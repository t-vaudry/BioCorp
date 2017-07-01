require 'watir'

class Test
	MESS = "SYSTEM ERROR : method missing"
	def initialize(name)
		@time = Time.now
		@name = name
		File.open("./output/results(#{@time}).txt", 'a') { |file| file.write("Starting Test : #{@name} \n") }
		
		# Init new browser
		@browser = Watir::Browser.new :firefox
		@browser.goto("http://localhost:3000")
	end
	def run()
		raise MESS
	end
	def finalize(result)
		@browser.close()
		if result
			File.open("./output/results(#{@time}).txt", 'a') { |file| file.write("Test (#{@name}) completed successfully! \n") }
		else
			File.open("./output/results(#{@time}).txt", 'a') { |file| file.write("Test (#{@name}) failed! \n") }
		end
	end
end
