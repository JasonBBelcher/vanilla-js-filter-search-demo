class Model {
  constructor(users) {
    this.users = users;
   
  }

  bindUserListChanged(cb) {
    this.onUserListChanged = cb;
  }

  filterSearch(value) {
    let filteredUsers = [];
    filteredUsers = this.users.filter((user) => {
      return user.name.toLowerCase().indexOf(value) > -1;
    })
    this.onUserListChanged(filteredUsers);
  }

}


class View {
  constructor() {
   this.app = this.getElement('#root');
   this.header = this.createElement('header');
   this.title = this.createElement('h1');
   this.title.textContent = 'Filter Search Demo';
   this.header.append(this.title);

   this.input = this.createElement('input', 'search-box');
   this.input.setAttribute('placeholder', 'start typing')
   this.input.type = 'text';
   this.input.name = 'search';

   this.userList = this.createElement('ul', 'collapse-able');

   this.app.append(this.header, this.input, this.userList);
  }

  getSearchText() {
    return this.input.value;
  }

  createElement(tag, className) {
    const element = document.createElement(tag);
    if(className) {
      element.classList.add(className);
    }

    return element;
  }

  getElement(selector) {
    const element = document.querySelector(selector);
    return element;
  }

  renderView(users){
   
    while (this.userList.firstChild) {
      this.userList.removeChild(this.userList.firstChild);
    }

    users.forEach((user) => {
      user.show;
      const li = this.createElement('li');
      const name = this.createElement('h2');
      name.textContent = user.name;
      li.append(name);

      name.addEventListener('click', e => {
        user.show = !user.show;

        if(user.show) {
          const street = this.createElement('p');
          street.textContent = user.address.street;
          const suite = this.createElement('p');
          suite.textContent = user.address.suite;
          const city = this.createElement('p');
          city.textContent = user.address.city;
          const zipcode = this.createElement('p');
          zipcode.textContent = user.address.zipcode;
          const email = this.createElement('p');
          email.textContent = user.email;
          const phone = this.createElement('p');
          phone.textContent = user.phone;

          li.append(street, suite, city, zipcode, email, phone);

        } 

        if(!user.show) {
          li.innerHTML = "";
          li.append(name);
        }
      })

      this.userList.append(li);
      
    });

  }

  bindUserSearch(handler) {
   
      this.input.addEventListener('input', e => {
       
        if(e.target.className == 'search-box') {
          console.log(e.target.value)
          handler(e.target.value)
        }
      })
    }

}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.model.bindUserListChanged(this.onUsersListChanged);
    this.view.bindUserSearch(this.handleSearch);
    this.onUsersListChanged(this.model.users);
    
  }

  onUsersListChanged = users => {
    console.log(users)
    this.view.renderView(users);
  }

  handleSearch = (textValue) => {
    console.log(textValue)
    this.model.filterSearch(textValue)
  }
}

fetch(`https://jsonplaceholder.typicode.com/users`).then(res => res.json()).then(data =>{ 
  
    const app = new Controller(new Model(data), new View());
  });

