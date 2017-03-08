@echo Node JS Version
node --version

@echo NMP Version 
npm --version

npm init 

@echo Install Server lib
pause
npm install express --save

@echo Install all libs 
pause
npm install morgan --save
npm install winston --save
npm install serve-favicon --save
npm install cookie-parser --save
npm install body-parser --save
npm install jade --save
npm install cron --save
npm install ejs --save
npm install nodemailer --save
npm install nodemailer-smtp-transport --save
npm install xoauth2 --save
npm install async --save
npm install googleapis --save
npm install cheerio --save 
npm install request --save 
npm install wundergroundnode -- save
npm install mongodb --save

@echo Install all libs _for testing?

if "%1" == "yes" GOTO :INSTALL-TEST
if "%1" == "no" GOTO :END

:INSTALL-TEST
npm install mocha  --save
npm install should --save
npm install supertest --save-dev
npm install jscoverage
npm install chai
GOTO END

:END
@echo Installing libs finished!