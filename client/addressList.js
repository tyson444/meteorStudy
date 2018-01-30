//Client에서 구독
Template.addressList.onCreated(function(){
    Session.set("cnt",10); //변수 초기값세팅 30
    var self = this;
    //self.subscribe("AddressBookData", 10);
    self.autorun(function(){
      self.subscribe("AddressBookData", Session.get("cnt"));//cnt만큼 구독
    });

    //마우스스크롤시, 마지막이면 세션 늘려주기
    $(window).scroll(function(){
      var scrollHeight = $(window).scrollTop() + $(window).height();
      var documentHeight = $(document).height();
      //200픽셀 이하면 세션값 10더함.
      if(scrollHeight +200 >= documentHeight){
        Session.set("cnt",Session.get("cnt")+10);
      }
    });

});


Template.addressList.helpers({
  list(){
    return AddressBook.find({},{/*limit:10,*/ sort:{name:-1}});
  },

  "offset" : function(index){
    index +=1;
    return index;
  },
  numbering(indexNum){
    indexNum +=5;
    return indexNum;
  }


});//End helpers



Template.addressList.events({
  "click button[name=more]" (evt,tmpl){
    Session.set("cnt",Session.get("cnt")+5);
  }
});//End events

Template.addressInput.events({
  'click button[name=saveAddress]' (evt,tmpl){
    /*입력데이터 생성*/
    var address = {
      name : tmpl.find("input[name=name]").value,
      phone : tmpl.find("input[name=phone]").value,
      email : tmpl.find("input[name=email]").value,
      company : tmpl.find("input[name=company]").value,
      birthday : tmpl.find("input[name=birthday]").value,
      owner : Meteor.userId()
    };

try{
  check(address.name, NotEmptyString);
  check(address.company, NotEmptyString);
  check(address.email, EmailString);
  check(address.phone, PhoneString);
  check(address.birthday, BirthDayString);
}catch(err){
  alert("입력값을 확인하세요. : [" + err.message + "]");
  return;
}


    /*검증후 등록*/

    /*DB값 넣기*/
    AddressBook.insert(address);

    /*input후 값 초기화가기*/
    tmpl.find("input[name=name]").value = "";
    tmpl.find("input[name=phone]").value = "";
    tmpl.find("input[name=email]").value = "";
    tmpl.find("input[name=company]").value = "";
    tmpl.find("input[name=birthday]").value = "";

  }
});


//Item 이벤트
Template.addressItem.events({
//제거 버튼
  'click button[name=remove]' (evt,tmpl){
    AddressBook.remove({ _id : this._id });
  },

//수정버튼
  'click button[name=modify]' (evt,tmpl){
    Session.set("editItem",this._id);
  },


//수정후 저장버튼
  'click button[name=save]' (evt,tmpl){
    var address = {
      name : tmpl.find("input[name=name]").value,
      phone : tmpl.find("input[name=phone]").value,
      email : tmpl.find("input[name=email]").value,
      company : tmpl.find("input[name=company]").value,
      birthday : tmpl.find("input[name=birthday]").value
    };

    AddressBook.update({_id:this._id},{$set:address});
    Session.set("editItem", null);
  },

//수정시 취소버튼
  'click button[name=cancel]' (evt,tmpl){
    Session.set("editItem", null);
  },


//뷰모드에서 텍스트 버튼 클릭시 수정모드로 전환
  'click .edit-thing' (evt, tmpl){
    Session.set("editItem",this._id);
  }

});

Template.addressItem.helpers({
  editing(){
    return this._id == Session.get("editItem");
  }
});
