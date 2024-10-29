'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('users', [
      {
        email: 'johndoe@domain.com',
        name: 'John Doe',
        avatar: '',
        password: '',
      },
      
      {
        email: 'alex@domain.com',
        name: 'Alex Smith',
        avatar: '',
        password: '',
      },
      {
        email: 'richard@domain.com',
        name: 'Richard',
        avatar: '',
        password: '',
      },
      {
        email: 'martin@domain.com',
        name: 'Martin Moe',
        avatar: '',
        password: '',
      },
      {
        email: 'niko@domain.com',
        name: 'Nicolas John',
        avatar: '',
        password: '',
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
