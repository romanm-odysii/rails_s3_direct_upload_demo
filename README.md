## Synopsis

This project shows how to upload file attachments for article with help of [jQuery File Upload](https://github.com/blueimp/jQuery-File-Upload) plugin.

## Motivation

A motivation was to create simple POC application for tests.

## How it works

When user wants to create Article (title, body, image_url), controller prepares URL for posting file to AWS S3 with help of `presigned_post`:

```ruby
  @s3_direct_post = @s3_bucket.presigned_post(
	key: "uploads/#{Time.now.to_i}-#{SecureRandom.uuid}/${filename}",
	success_action_status: '201' # Important for proper work of JavaScript code!
  )
```

Rendered HTML form contains `<%= f.file_field :image_url %>`.
When user selects file for uploading, this triggers callback JS function that handle uploading file to provided URL.
After successful uploading AWS S3 returns XML file that contains target URL and this value is added to `file_field` for further committing to Rails application.

## Installation

Run `bundle install` in root of project.

Define following environment variables: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_BUCKET`, `AWS_REGION` .

### CORS policy in AWS S3

Set CORS policy in bucket:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
  <CORSRule>
    <AllowedOrigin>http://localhost:3000</AllowedOrigin>
    <AllowedMethod>HEAD</AllowedMethod>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>POST</AllowedMethod>
    <AllowedMethod>PUT</AllowedMethod>
    <AllowedHeader>*</AllowedHeader>
    <MaxAgeSeconds>300</MaxAgeSeconds>
  </CORSRule>
</CORSConfiguration>
```

#### See also:

* http://docs.aws.amazon.com/AmazonS3/latest/dev/cors.html
* http://docs.aws.amazon.com/AmazonS3/latest/dev/cors-troubleshooting.html
