// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
$(document).ready(function () {
  $(function() {
    $('.directUpload').find("input:file").each(function(i, elem) {
      var fileInput    = $(elem);
      var form         = $(fileInput.parents('form:first'));
      var submitButton = form.find('input[type="submit"]');
      var progressBar  = $("<div class='bar'></div>");
      var barContainer = $("<div class='progress'></div>").append(progressBar);
      fileInput.after(barContainer);
      fileInput.fileupload({
        fileInput:        fileInput,
        url:              s3_post_url,
        type:            'POST',
        autoUpload:       true,
        formData:         s3_form_data,
        paramName:        'file', // S3 does not like nested name fields i.e. name="user[image_url]"
        dataType:         'XML',  // S3 returns XML if success_action_status is set to 201
        replaceFileInput: false,
        progressall: function (e, data) {
          var progress = parseInt(data.loaded / data.total * 100, 10);
          progressBar.css('width', progress + '%');
        },
        start: function (e) {
          console.log('Started.');
          submitButton.prop('disabled', true);

          progressBar.
            css('background', 'green').
            css('display', 'block').
            css('width', '0%').
            text("Loading...");
        },
        done: function(e, data) {
          console.log('Uploading finished successfully.');
          submitButton.prop('disabled', false);
          progressBar.text("Uploading done");

          // extract key and generate URL from response
          var key   = $(data.jqXHR.responseXML).find("Key").text();
          var url   = s3_post_url + '/' + key;

          // create hidden field
          var input = $("<input />", { type:'hidden', name: fileInput.attr('name'), value: url });
          form.append(input);
        },
        fail: function(e, data) {
          alert('There was an error uploading your file. Please try again.');
          console.log("Failed");
          progressBar.
            css("background", "red").
            text("Failed");
        }
      });
    });
  });
});
