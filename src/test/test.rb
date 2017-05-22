class Test
	MESS = "SYSTEM ERROR : method missing"
	def initialize(name)
		@name = name
		puts "Starting Test : #{@name}"
	end
	def run()
		raise MESS
	end
	def finalize(result)
		if result
			puts "Test (#{@name}) completed successfully!"
		else
			puts "Test (#{@name}) failed!"
		end
	end
end
