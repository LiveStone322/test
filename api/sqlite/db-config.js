const knex = require('knex');
const config = require('../knexfile');

const db = knex(config.development)

module.exports = {
    find,
    findById,
    insert,
    update,
    remove
}

function find() {
    return db('stationery');
}

function findById(id) {
    return db('stationery').where({id: Number(id)});
}

function insert(post) {
    return db('stationery')
        .insert(post)
        .then(ids => ({ id: ids[0] }));
}

function update(id, post) {
    return db('stationery')
        .where('id', Number(id))
        .update(post);
}

function remove(id) {
    return db('stationery')
        .where('id', Number(id))
        .del();
}

