Meteor.publish("AddressBookData", function(count){
  return AddressBook.find({},{ limit : count, sort : { Name : -1 }})
});
