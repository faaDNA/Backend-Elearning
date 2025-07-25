let userData = require("../data/users");

exports.getUsers = () => {
  return userData || [];
};

exports.getUserById = (id: number) => {
  return userData.find((user: any) => user.id === id);
};

exports.createUser = (user: any) => {
  const newId = userData.length ? userData[userData.length - 1].id + 1 : 1;
  const newUser = { id: newId, ...user };
  userData.push(newUser);
  return newUser;
};

exports.updateUser = (id: number, updatedUser: any) => {
  const index = userData.findIndex((user: any) => user.id === id);
  if (index === -1) return null;
  userData[index] = { ...userData[index], ...updatedUser };
  return userData[index];
};

exports.deleteUser = (id: number) => {
  const index = userData.findIndex((user: any) => user.id === id);
  if (index === -1) return false;
  userData.splice(index, 1);
  return true;
};
