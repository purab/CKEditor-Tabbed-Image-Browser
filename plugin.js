//Refering following API
//http://docs.cksource.com/ckeditor_api/symbols/CKEDITOR.dialog.html

/*
 * Use this line in config.js or your html file where you are loading the ckeditor

CKEDITOR.config.tabbedimages = new Array("http://www.iiacanadanationalconference.com/wp-content/uploads/2013/01/test.jpg", "http://www.iiacanadanationalconference.com/wp-content/uploads/2013/01/test.jpg", "http://www.iiacanadanationalconference.com/wp-content/uploads/2013/01/test.jpg", "http://www.iiacanadanationalconference.com/wp-content/uploads/2013/01/test.jpg");

CKEDITOR.config.tabbedthumbimages = new Array("http://www.iiacanadanationalconference.com/wp-content/uploads/2013/01/test.jpg", "http://www.iiacanadanationalconference.com/wp-content/uploads/2013/01/test.jpg", "http://www.iiacanadanationalconference.com/wp-content/uploads/2013/01/test.jpg", "http://www.iiacanadanationalconference.com/wp-content/uploads/2013/01/test.jpg");

****For Reloading the images in tabbed browser****
*You need to pass the updated image urls to config variable through javascript or php
var vTypeOf = typeof(CKEDITOR);
    if(vTypeOf == 'object') {    
        CKEDITOR.config.tabbedimages  = <?php echo $array_of_images; ?>;
        CKEDITOR.config.tabbedthumbimages = <?php echo $array_of_images; ?>;
        if (typeof ReplaceDSbrowserHTML == 'function') { 
             ReplaceDSbrowserHTML(); 
        }
    }
 * 
 **/

//see if toString returns proper class attributes of objects that are arrays
//returns -1 if it fails test
//returns true if it passes test and it's an array
//returns false if it passes test and it's not an array

function tabbedloadjscssfile(filename, filetype) {
    if (filetype === "js") { //if filename is a external JavaScript file
        var fileref = document.createElement('script');
        fileref.setAttribute("type", "text/javascript");
        fileref.setAttribute("src", filename);
    }
    else if (filetype === "css") { //if filename is an external CSS file
        var fileref = document.createElement("link");
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", filename);
    }
    if (typeof fileref !== "undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref);
}

tabbedloadjscssfile(CKEDITOR.basePath + CKEDITOR.plugins.basePath + 'tabbedimagebrowser/plugin.css', "css"); ////dynamically load and add this .css file

function tabbedis_array(o)
{
// make sure an array has a class attribute of [object Array]
var check_class = Object.prototype.toString.call([]);
if (check_class === '[object Array]')
{
if (o.length > 0)
{
    // test passed, now check
    return Object.prototype.toString.call(o) === '[object Array]';
}
else
{
    return 0;
}

}
else
{
// may want to change return value to something more desirable
return -1;
}
}

var SetURLtoCKeditor = function(imgurl) {    
    //CKEDITOR.tools.callFunction(1, 'test.com', '');
    var dialog = CKEDITOR.dialog.getCurrent();
    dialog.setValueOf('info', 'txtUrl', imgurl);  // Populates the URL field in the Links dialogu
    //dialog.setValueOf('info','protocol','');  // This sets the Link's Protocol to Other which loads the file from the same folder the link is on
    dialog.setValueOf('info', 'txtWidth', '');
    dialog.setValueOf('info', 'txtHeight', '');
    dialog.setValueOf('advanced', 'txtdlgGenStyle', 'max-width:100%;max-height:100%');
};

var GenerateTabbedHTMLfromArray = function(largeimages, thumbimages, dsbrowblocklabel) {
    var check_tabbedimages = tabbedis_array(largeimages); //Checking is array
    var tabbedimages_html = '';
    if (check_tabbedimages)
    {
        if(dsbrowblocklabel !='') 
        {
            tabbedimages_html += '<div id="dsbrandimages">'+dsbrowblocklabel+'</div>';
        }
        tabbedimages_html += '<div id="dsAssetsImagesDiv" >';
        for (var i = 0; i < largeimages.length; i++)
        {
            tabbedimages_html += '<div class="dsimgandradiocontainerdiv">';
            tabbedimages_html += '<label for="' + i + 'dsassets" class="dsimgcontainerdiv">';
            tabbedimages_html += '<img class="dsimageblock" src="' + thumbimages[i] + '"/>';
            tabbedimages_html +='</label>';
            tabbedimages_html +='<div class="dsimageradio">';
            tabbedimages_html += '<input id="' + i + 'dsassets" type="radio" name="dsimagebrowserradio" value="1" onclick="SetURLtoCKeditor(\'' + largeimages[i] + '\')">';
            tabbedimages_html +='</div>';
            tabbedimages_html +='</div>';
        }
        tabbedimages_html += '</div>';
    }
    if((thumbimages === undefined || thumbimages ==='') && dsbrowblocklabel ==='')
    {
        tabbedimages_html += '<div>No images available.</div>';
    }
    
    return tabbedimages_html;
};

var GenerateTabbedbrowserHTML = function() {
    var tabbedimages_html = '';
    if(CKEDITOR.config.tabbedimages != undefined && CKEDITOR.config.tabbedthumbimages != undefined)
    {
        tabbedimages_html = GenerateTabbedHTMLfromArray(CKEDITOR.config.tabbedimages, CKEDITOR.config.tabbedthumbimages,'');  
    }
    else 
    {
        tabbedimages_html ='<div>No images available.</div>';
    }
    return tabbedimages_html;
};


var ReplaceDSbrowserHTML = function() {    
    var tabbedimages_html = GenerateTabbedbrowserHTML();    
    document.getElementById('dsbrowserfullcontainer').innerHTML= tabbedimages_html;
};

/*
* 
* Adding the new plugin to CKEDIOR
*/
CKEDITOR.plugins.add('tabbedimagebrowser',
{
    init: function(editor)
    {
        // Take the dialog name and its definition from the event data.
        CKEDITOR.on('dialogDefinition', function(ev)
        {
            var dialogName = ev.data.name;
            var dialogDefinition = ev.data.definition;
            var dialog = ev.data;
            // Check if the definition is from the dialog we're interested on (the "Image" dialog).
            if (dialogName === 'image')
            {       
                 var tabbedimages_html = GenerateTabbedbrowserHTML();
                    
                 // Add a new tab to the "Link" dialog.
                dialogDefinition.addContents({
                    id : 'TabbedImageBrowser',
                    label : 'Tabbed Image Browser',
                    accessKey : 'M',
                    elements : [
                            {
                                type: 'hbox',
                                id: 'mydsbrowserhboxele',
                                children: [
                                    {
                                        type: 'html',
                                        html: '<div id="dsbrowserfullcontainer">'+tabbedimages_html+'</div>'
                                    }
                                ]
                            },
                            {
                            id: 'dsimagetext',
                            type: 'text',
                            accessKey: 'M',
                            style:'display:none'
                            }
                                ]
                        });
                   dialogDefinition.onShow = function () {
                        ReplaceDSbrowserHTML();
                    };
                    
                }
        });

    }
});
