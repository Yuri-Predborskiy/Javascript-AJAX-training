$(function () {

  var Requests = function (url, data) {
    this.url = url;
    this.data = data || {};
  };

  Requests.prototype.post = function(data){
    return $.ajax({
      method: 'POST',
      url: this.url,
      data: data || this.data
    });
  };
  
  Requests.prototype.put = function(data){
    return $.ajax({
      method: 'PUT',
      url: this.url,
      data: data || this.data
    });
  };
  
  Requests.prototype.get = function () {
    return $.ajax({
      method: 'GET',
      url: this.url,
    });
  }

  var render = {
    addTpl: function(item){
      var result = '';
      for (var i in item)
      i!='id' ? 
      result+=' <span data-value="'+i+'">'+item[i]+'</span> ' : result+=' <span class="hidden" data-value="'+i+'">'+item[i]+'</span> '
      return result;
    },
    parse: function(data){
      var self = this;
      return data.map(function(item){
        return '<li class="list_item">'+
              self.addTpl(item)  
          +'</li>';
      }).join('');
    },
    refresh: function (selector, data) {
      $('.'+selector).html(this.parse(data));
    },
    getData: function(selector){
      var obj = {};
      selector.find('input').each(function(){
        obj[$(this).attr('name')] = $(this).val(); 
      })
      $.extend(obj, {id : Math.round(Math.random() * 10000)});
      
      return obj;
    }
  };


  var API = new Requests('/api');
  var ready = 'Application started!';
  var h1 = $('h1');
  var $body = $('body');
  var listClass = 'list', $form = $('form'), $modal = $('.modal'), $overlay = $('.modal-overlay');
  
  var modal = {
    open: function(){
      $modal.addClass('open');
    },
    close: function(){
      $modal.removeClass('open');
    },
    create: function(template){
      var resultTpl = '';
      template.find('span').each(function(){
        var type, 
        name = $(this).attr('data-value'), value =  $(this).text();
        
        name === 'id' ? type='hidden' : type='text';
        
        resultTpl+= '<label>'+
          name +'<input type="'+type+'" value="'+ value +'" data-value="'+ name +'">'+
          '</label> <hr>';
      });
      $modal.html(resultTpl+'<button class="edit">EDIT</button>');
    },
    putData: function(){
      var data = {};
      $modal.find('input').each(function(){
        data[$(this).attr('data-value')] = $(this).val();
      })
      return data;
    }
  };
  
  $body.on('click', '.edit', function(){
    var data = modal.putData();
    API.put(data).then(function(){
      return API.get()
    }).then(function(res){
      var data = JSON.parse(res);
      render.refresh(listClass, data);
      modal.close();
    });
  });

  h1.text(ready);

  var ul = $('<ul class="' + listClass + '"> <li> item </li> </ul>');

  ul.appendTo($body);
  
  API.get().done(function (res) {
    var data = JSON.parse(res);
    render.refresh(listClass, data);
  });
  
  $body.on('click', '.list_item', function(){
    modal.create($(this));
    modal.open();
  });
  
  $overlay.on('click', function(){
    modal.close();
  })
  
  
  
  $form.on('submit', function(e){
    e.preventDefault();
    var data = render.getData($(this));
    API.post(data).then(function(){
      
      return API.get()
      
    }).then(function(res){
      var data = JSON.parse(res);
      render.refresh(listClass, data);
    });
  });
});