require 'rubygems'
require './createAccount'

createAccount = CreateAccount.new("CreateAccount")
result = createAccount.run()
createAccount.finalize(result)