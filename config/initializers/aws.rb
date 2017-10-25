Aws.config.update(
  access_key_id:     ENV['AWS_ACCESS_KEY_ID'],
  secret_access_key: ENV['AWS_SECRET_ACCESS_KEY']
)
if ENV.has_key?('S3_ENDPOINT')
  Aws.config.update(
    endpoint:          ENV['S3_ENDPOINT'],
    force_path_style:  true,
    region:            ENV.fetch('AWS_REGION')
  )
end
