require.config({
    baseUrl: 'js/lib',

    packages: [
      { 
        name: 'prime',
        main: 'index'
      },
      { 
        name: 'slick',
        main: 'index'
      },
      { 
        name: 'elements',
        main: 'index'
      }
    ]
});

requirejs(['../app']);
