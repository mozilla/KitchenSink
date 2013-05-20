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
      },
      { 
        name: 'agent',
        main: 'index'
      }
    ]
});

requirejs(['../app']);
