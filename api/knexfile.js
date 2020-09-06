// Update with your config settings.

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './sqlite/db.sqlite'
    },
    useNullAsDefault: true,
    migrations: {
      directory: './sqlite/migrations'
    },
    seeds: {
      directory: './sqlite/seeds'
    }
  }
  
};
