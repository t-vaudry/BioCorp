require 'rubygems'
require './browser'
require './createAccount'

createAccount = CreateAccount.new("CreateAccount")
createAccount.run()
createAccount.finalize(true)



