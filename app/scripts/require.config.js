(function(){
    'use strict';

    require.config({
        shim: {
            underscore: {
                exports: '_'
            },
            backbone: {
                deps: ['underscore', 'jquery'],
                exports: 'Backbone'
            },
            TweenMax: {
                exports: 'TweenMax'
            },
            TimelineMax: {
                deps: ['TweenMax'],
                exports: 'TimelineMax'
            },
            'jquery.gsap': {
                deps: ['jquery'],
                exports: '$'
            },
            'soundmanager': {
                exports: 'soundManager'
            }
        },
        paths: {
            // libraries
            jquery: 'bower_components/jquery/jquery',
            backbone: 'bower_components/backbone/backbone',
            underscore: 'bower_components/underscore/underscore',
            soundmanager:'bower_components/soundmanager/script/soundmanager2-nodebug-jsmin',
            text: 'bower_components/requirejs-text/text',
            TweenMax: 'bower_components/greensock/src/minified/TweenMax.min',
            TimelineMax: 'bower_components/greensock/src/minified/TimelineMax.min',
            'jquery.gsap': 'bower_components/greensock/src/minified/jquery.gsap.min',
            'jquery.mousewheel': 'bower_components/jquery-mousewheel/jquery.mousewheel',

            // core logic
            'controller': 'core/controller',
            'slide.factory': 'core/slide.class',
            'transitions': 'core/transitions',
            'anim': 'core/animations',
            'util': 'core/util',

            //modals
            //'modal': 'modal/modal'

        }
    });

}());