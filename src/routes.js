const {
    saveBookHandler,
    viewBooksHandler,
    viewBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler
} = require('./handlers');

/** @type {import('@hapi/hapi').ServerRoute[]} */
const routes = [
    {
        method: 'POST',
        path: '/books',
        handler: saveBookHandler
    },
    {
        method: 'GET',
        path: '/books',
        handler: viewBooksHandler
    },
    {
        method: 'GET',
        path: '/books/{bookId}',
        handler: viewBookByIdHandler
    },
    {
        method: 'PUT',
        path: '/books/{bookId}',
        handler: editBookByIdHandler
    },
    {
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: deleteBookByIdHandler
    }
];

module.exports = routes;