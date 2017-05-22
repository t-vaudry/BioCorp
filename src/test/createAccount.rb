require './test'
require './browser'

class CreateAccount < Test
	def initialize(name)
		super(name)
	end
	def run()
		# Init new browser
		browser = Browser.new()
		browser.goTo("http://localhost:3000")

		browser.clickButton("signInButton", nil)
		browser.clickLink("/signup")

		browser.enterText("firstname", "Thomas")
		browser.enterText("lastname", "Vaudry-Read")
		browser.enterText("emailaddr", "tvaudryread@gmail.com")
		#browser.enterText("password", "Biocorp")
		browser.enterText("accHolder", "Concordia")
		browser.enterText("institution", "University")
		browser.enterText("ponumber", "123 Random")
		browser.selectList("invoice", "creditcard")

		browser.clickButton(nil, "submit")
		sleep(30)

		# Close browser
		browser.close()
	end
end
