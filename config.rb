# Require any additional compass plugins here.
require 'bootstrap-sass'
require 'font-awesome-sass'

# Set this to the root of your project when deployed:
http_path = "/"
css_dir = "css"
sass_dir = "sass"
fonts_dir = "fonts"
images_dir = "img"
javascripts_dir = "js"

relative_assets = true

# You can select your preferred output style here (can be overridden via the command line):
output_style = :compressed

# To enable relative paths to assets via compass helper functions. Uncomment:
# relative_assets = true

# To disable debugging comments that display the original location of your selectors. Uncomment:
# line_comments = false


# If you prefer the indented syntax, you might want to regenerate this
# project again passing --syntax sass, or you can uncomment this:
# preferred_syntax = :sass
# and then run:
# sass-convert -R --from scss --to sass sass scss && rm -rf sass && mv scss sass

preferred_syntax = :scss
module Sass::Script::Functions
  def asset_url(string)
    assert_type string, :String
    Sass::Script::String.new("url(../img/#{string.value})")
  end
  alias_method :"asset-url", :asset_url
  declare :"asset-url", :args => [:string]
end