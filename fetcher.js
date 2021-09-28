const request = require('request');
const fs = require('fs');
const readline = require('readline');

const args = process.argv.slice(2); // Command line arguments

//function to write and read file
const writeToFile = function(data) {

  fs.writeFile(args[1], data, err => {
    if (err) {
      console.error("File path invalid write error", err); //error because test is a directory and this function deals with files only
      return;
    }
    fs.readFile(args[1], 'utf8' , (err, data) => {
      if (err) {
        console.error("File path invalid read error", err);
        return;
      }
      console.log(`Downloaded and saved ${data.length} bytes to ${args[1]}`);
    });
  });
  //return true;
};

const downloader = function(callback) {

  request(args[0], (error, response, body) => {
    if (error) {
      console.log("HTTP URL didn't work!" , error);
      return;
    } else if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    callback(body);
  });
  
};

downloader((body) => {
  
  if (!args[1]) {
    console.log("Error : Local File path not found to be written");
    return;
  }
  if (fs.existsSync(args[1])) {
    
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('File path already exists. Do you want to overwrite the file? (Y for yes) ', (answer) => {
      console.log(`Thank you for your answer: ${answer}`);
      
      if ((answer === 'Y') || (answer === 'y')) {
        writeToFile(body);
      } else {
        console.log(`Operation aborted!`);
      }
      rl.close();
    });
  } else {
    writeToFile(body);
  }
  
});