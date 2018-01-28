Template.addressList.helpers({
  list(){
    return AddressBook.find({},{limit:10, sort:{name:-1}});
  }

});//End helpers



Template.addressList.events({
  'click button[name=remove]' (evt,tmpl){
    AddressBook.remove({ _id : this._id });
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
      birthday : tmpl.find("input[name=birthday]").value
    };

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
