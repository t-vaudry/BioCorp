require './test'

class CreateAccount < Test
	def initialize(name)
		super(name)
	end
	def run()
		@browser.button(:id, "signInButton").click
		@browser.link(:text, "Customer Registration Form").click
		@browser.text_field(:id, "firstname").set("Thomas")
		@browser.text_field(:id, "lastname").set("Vaudry-Read")
		@browser.text_field(:id, "emailaddr").set("tvaudryread@gmail.com")
		@browser.text_field(:id, "motdepasse").set("Biocorp")
		@browser.text_field(:id, "accHolder").set("Concordia")
		@browser.text_field(:id, "institution").set("University")
		@browser.text_field(:id, "ponumber").set("123 Random")
		@browser.select_list.select("Blanket Order (on File)")
		@browser.button(:name, "submit").click

		sleep(10)
		return @browser.button(:id, "signOutButton").exists?
	end
end
