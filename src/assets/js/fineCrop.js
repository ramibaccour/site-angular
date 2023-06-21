(function ($) 
{
    $.fn.finecrop = function (options) 
    {

        var defaults = 
        {
            viewHeight: 0,
            cropWidth: 200,
            cropHeight: 200,
            cropInput: 'myImage',
            cropOutput: 'mysource',
            zoomValue: 10,
            index  : 0
        };
        // options.cropWidth    options.cropHeight 
        var zoomWidth = 0;
        var zoomHeight = 0;
        var myZoom = 100;
        var a,b,x,y;
        a = 90/(100/window.screen.width);
        b = 90/(100/window.screen.height)
        
        if(options.cropWidth > a)
            zoomWidth = options.cropWidth - a;
        if(options.cropHeight > b)
            zoomHeight = options.cropHeight - b;
        
        x= (zoomWidth * (100/options.cropWidth));
        y= (zoomHeight * (100/options.cropHeight))
        if(zoomWidth > zoomHeight)
            myZoom = 100 - x;
        if(zoomWidth < zoomHeight)
            myZoom = 100 - y;
        var settings = $.extend({}, defaults, options);
        return this.each(function () 
        {
            var $obj = $(this);
            $($obj).change(function () 
            {
                $("#action-" + settings.index).hide();
                if (this.files && this.files[0]) 
                {
                    var reader = new FileReader();
                    reader.onload = function (e) 
                    {
                        var image = new Image();
                        image.src = e.target.result;
                        image.onload = (imageLoadet =>
                        {
                            $('#' + settings.cropInput).attr('src', e.target.result).css('opacity', 0);

                            $('#' + settings.cropInput).attr('height', image.width + 'px')
                            $(".cropHolder").show();
                            setTimeout(function () {
                                cropstart();
                            }, 1000);
                        }) 
                        
                        

                    };
                    reader.readAsDataURL(this.files[0]);
                }
            });

            function cropstart() 
            {
                /* Let's Create canvas and backgrounds
                 * First : background canvas, it will behind all
                 * Second : transparent background
                 * Third: 2nd canvas, where image will get cropped 
                 */
                var cropContainer = $("#cropWrapper-" + settings.index);
                cropContainer.attr("style","zoom : " + myZoom+"%");
                var bgcanvas = document.createElement("canvas");
                bgcanvas.id = "bgCanvas-" + settings.index;
                bgcanvas.style.border = '1px solid #000';
                bgcanvas.style.position = "absolute";
                bgcanvas.style.top = "0";
                bgcanvas.style.left = "0";
                bgcanvas.style.right = "0";
                bgcanvas.style.bottom = "0";
                bgcanvas.style.margin = "auto";
                bgcanvas.style.zoom = myZoom+"%";
                $(cropContainer).append(bgcanvas);

                // black sheet div
                var blacksheet = document.createElement('div');
                blacksheet.id = "blacksheet-" + settings.index;
                blacksheet.style.position = "absolute";
                blacksheet.style.top = "0";
                blacksheet.style.left = "0";
                blacksheet.style.right = "0";
                blacksheet.style.bottom = "0";
                blacksheet.style.margin = "auto";
                blacksheet.style.backgroundColor = "rgba(0,0,0,0.7)";
                blacksheet.style.width = "100%";
                blacksheet.style.height = "100%";
                blacksheet.style.zoom = myZoom+"%";
                $(cropContainer).append(blacksheet);

                // cropped canvas
                var getCropped = document.createElement('canvas');
                getCropped.id = "getCropped-" + settings.index;
                getCropped.width = settings.cropWidth;
                getCropped.height = settings.cropHeight;
                getCropped.style.border = '1px solid #000';
                getCropped.style.position = "absolute";
                getCropped.style.top = "0";
                getCropped.style.left = "0";
                getCropped.style.right = "0";
                getCropped.style.bottom = "0";
                getCropped.style.margin = "auto";
                getCropped.style.zoom = myZoom+"%";
                $(cropContainer).append(getCropped);



                /* CONSTANT
                 * These two variable are constant as the actual width or height of an image is constant
                 * 1. imgSrc : source of Image
                 * 2. actualWidth : Natural width of image
                 * 3. actualHeight : Natural height of image
                 */
                var imgSrc = document.getElementById(settings.cropInput); //$("#myImage");
                var actualWidth = imgSrc.naturalWidth;
                var actualHeight = imgSrc.naturalHeight;
                var zoomValue = 0; // initial

                // imgSrc.setAttribute('height', 500 + 'px'); // initial

                var moveHorizontal = document.getElementById("xmove-" + settings.index);
                var moveVertical = document.getElementById("ymove-" + settings.index);
                var zoomIn = document.getElementById("zplus-" + settings.index);
                var zoomOut = document.getElementById("zminus-" + settings.index);



                var elemWidth, elemHeight, lValue, tValue;

                function getImgRef() 
                {
                    elemWidth = imgSrc.width;
                    elemHeight = imgSrc.height;
                    lValue = (elemWidth - settings.cropWidth) / 2;
                    tValue = (elemHeight - settings.cropHeight) / 2;
                    // --- dynamic max values ---
                    moveHorizontal.setAttribute('max', (elemWidth - settings.cropWidth));
                    moveVertical.setAttribute('max', (elemHeight - settings.cropHeight));

                    moveHorizontal.setAttribute('value', (elemWidth - settings.cropWidth) / 2);
                    moveVertical.setAttribute('value', (elemHeight - settings.cropHeight) / 2);

                }
                getImgRef();


                document.getElementById("zplus-" + settings.index).onclick = function () {
                    var imgSrcHeight = parseInt(imgSrc.getAttribute('height'));
                    imgSrc.setAttribute('height', (imgSrcHeight + settings.zoomValue) + 'px');
                    getImgRef();
                    bgCanvas(lValue, tValue);
                }
                document.getElementById("zminus-" + settings.index).onclick = function () {
                    var imgSrcHeight = parseInt(imgSrc.getAttribute('height'));
                    imgSrc.setAttribute('height', (imgSrcHeight - settings.zoomValue) + 'px');
                    getImgRef();
                    bgCanvas(lValue, tValue);
                }
                document.getElementById("cropSubmit-" + settings.index).onclick = function () 
                {
                    $("#action-" + settings.index).show();
                    $("#" + settings.cropOutput).attr('src', getCropped.toDataURL());
                    $(bgcanvas).remove();
                    $(blacksheet).remove();
                    $(getCropped).remove();
                    $(".cropHolder").hide();
                }
                document.getElementById("closeCrop-" + settings.index).onclick = function(){
                    $(bgcanvas).remove();
                    $(blacksheet).remove();
                    $(getCropped).remove();
                    $(".cropHolder").hide();
                }
                // ------------- -------- drawImage properties ---------- -----------------
                function cropCanvas(x, y) {

                    var imgSrcC = bgcanvas;
                    var context = getCropped.getContext("2d");

                    var cwidth = getCropped.width;
                    var cheight = getCropped.height;
                    
                    var sx = (elemWidth - cwidth) / 2;
                    var sy = (elemHeight - cheight) / 2;
                    var swidth = cwidth;
                    var sheight = cheight;

                    var dwidth = cwidth;
                    var dheight = cheight;

                    context.clearRect(0, 0, cwidth, cheight);
                    
                    context.drawImage(imgSrcC, parseInt(sx), parseInt(sy), parseInt(swidth), parseInt(sheight), 0, 0, parseInt(dwidth), parseInt(dheight));
                    getCropped.toBlob(function(blob) 
                    {
                        var muFileReader = new FileReader();
                        muFileReader.onload = (e) =>
                        {
                            document.getElementById("imageOptimiser-" + settings.index).setAttribute("src",e.target.result )
                        }
                        muFileReader.readAsDataURL(blob);
                        
                    }, 'image/jpeg', 0.8);
                };


                // --------------- bg canvas -------------------
                function bgCanvas(x, y) 
                {
                    lValue = x;
                    tValue = y;
                    var context = bgcanvas.getContext("2d");

                    var cwidth = elemWidth;
                    var cheight = elemHeight;
                    bgcanvas.width = cwidth;
                    bgcanvas.height = cheight;
                    context.clearRect(0, 0, cwidth, cheight);
                    /*
                     * To ensure the perspective of an image, here is the calculation for new width and height
                     * nw/nh = w/h;
                     * nh = (h*nw)/w;
                     + these below 'minus' lines are not in use anymore 
                     - var dwidth = cwidth + zoomValue;
                     - var dheight = (cheight * (cwidth + zoomValue))/cwidth;
                     */


                    var dwidth = cwidth;
                    var dheight = cheight;

                    var sx = (((x - (elemWidth - settings.cropWidth) / 2) * actualWidth) / elemWidth) + zoomValue;
                    var sy = (((y - (elemHeight - settings.cropHeight) / 2) * actualHeight) / elemHeight);
                    var swidth = (cwidth * actualWidth) / elemWidth;
                    var sheight = (cheight * actualHeight) / elemHeight;
                    
                    context.drawImage(imgSrc, parseInt(sx), parseInt(sy), parseInt(swidth), parseInt(sheight), 0, 0, parseInt(dwidth), parseInt(dheight));
                    cropCanvas(x, y);
                };

                bgCanvas(lValue, tValue);
                /* get the current input
                   for IE, 'oninput' doesn't work, should use 'onchange' 
                */
                if (navigator.appName == 'Microsoft Internet Explorer' || !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/rv:11/)) || (typeof $.browser !== "undefined" && $.browser.msie == 1)) {
                    alert("please do not use IE :) ");
                } 
                else 
                {
                    moveHorizontal.oninput = function (event) 
                    {
                        bgCanvas(event.target.value, tValue)
                    }
                    moveVertical.oninput = function (event) 
                    {
                        bgCanvas(lValue, event.target.value);
                    }
                }
            }
        });
    };
}(jQuery));