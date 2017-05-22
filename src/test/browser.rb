require 'rubygems'
require 'watir'

# define class Browser
class Browser
	def initialize()
		@browser = Watir::Browser.new :firefox
	end

	def goTo(url)
		@browser.goto url
	end

	def clickButton(id, name)
		if !id.nil?
			@browser.button(:id => id).click
		end
		if !name.nil?
			@browser.button(:name => name).click
		end
	end

	def clickLink(href)
		@browser.link(:href => href).wait_until_present.click
	end

	def enterText(name, text)
		@browser.text_field(:name => name).set text	
	end

	def selectList(name, option)
		@browser.select_list(:name => name).select_value option
	end

	def close()
		@browser.close
	end
end
