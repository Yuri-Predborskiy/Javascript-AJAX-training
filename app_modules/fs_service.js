const fs = require('fs');

class Database {
  static write(entreeData) {
    return new Promise((resolve, reject) => {
      fs.readFile('./data.json', 'utf-8', (err, data) => {
        if (err) throw err;
        else {
          if (data == '')
            fs.writeFile('data.json', JSON.stringify([entreeData]), (err) => {
              err ? reject({
                'done': false
              }) : resolve({
                'done': true
              });
            });
          else {
            let json = JSON.parse(data);
            for (let i=0; i<json.length; i++) {
              if (json[i].id == entreeData.id) {
                reject({'done': false, 'message': 'user with this id is already exist'});
                return;
              };
            }
            json.push(entreeData);
            fs.writeFile('data.json', JSON.stringify(json), (err) => {
              err ? reject({
                'done': false
              }) : resolve({
                'done': true
              });
            });
          }
        }
      });
    })
  }
  static get() {
    return new Promise(function (resolve, reject) {
      fs.readFile('./data.json', 'utf-8', (err, data) => {
        if (err) throw err;
        resolve(data);
      });
    });
  }
  static repl(enteredData, todo) {
    return new Promise((resolve, reject)=>{
      fs.readFile('./data.json', 'utf-8', (err, data) => {
        if (err) throw err;
        let parseData = JSON.parse(data);
        for (let i=0; i<parseData.length; i++) {
          if (parseData[i].id == enteredData.id && todo == 'replace')
            parseData.splice(i, 1, enteredData);
          else if (parseData[i].id == enteredData.id && todo == 'remove')
            parseData.splice(i, 1);
        }
        fs.writeFile('data.json', JSON.stringify(parseData), ()=>{
          resolve({done: true})
        })
      });
    })
  }
}

module.exports = Database;