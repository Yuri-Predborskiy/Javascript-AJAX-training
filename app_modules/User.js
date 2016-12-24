const FIELDS = ['id','name', 'date', 'address', 'email']

class User {
  constructor(data){
    this.name = data.name;
    this.date = data.date;
    this.address = data.address;
    this.email = data.email;
    this.id = data.id;
  }
  static create(data){
    var obj = {};
    for (let i in data) {
      if (FIELDS.indexOf(i)>-1) {
        obj[i] = data[i]
      } else return {error: 'Fields incorrect!'};
    }
    return new User(obj)
  }
}

module.exports = User;