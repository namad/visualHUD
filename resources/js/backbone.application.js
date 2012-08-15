(function(){
    var resolveNamespace = function(className, root) {
        var parts = className.split('.'),
            root = root || window,
            current = root;

        for(var a = 0, b = parts.length; a < b; a++) {
            current = current[parts[a]] || {};
        }

        return current;
    };

    var Application = function(options) {
        _.extend(this, options || {});
        this.eventbus = new EventBus({application: this});
        this.initialize.apply(this, arguments);

        var nameSpace = window;

        // create global reference in the defined namespace
        if(this.nameSpace) {
            nameSpace = nameSpace[this.nameSpace]
        }
        if(this.name) {
            nameSpace[this.name] = this;
        }

        $($.proxy(this.onReady, this));
    };

    _.extend(Application.prototype, {
        name: 'application',

        models: {},
        collections: {},
        controllers: {},

        /**
         * Abstract fuction that will be called during application instance creation
         */
        initialize: function(options) {
            return this;
        },

        /**
         * Called on documentReady
         */
        onReady: function() {
            // initialize controllers
            this.initializeControllers(this.controllers || {});
            // call to controller.onLauch callback
            this.launchControllers();
            // call application.lauch callback
            this.launch.call(this);
        },

        /**
         * Function that will convert string identifier into the instance reference	 
         */ 
        parseClasses: function(classes) {
            var hashMap = {};

            _.each(classes, function(cls) {
                var classReference = resolveNamespace(cls),
                    id = cls.split('.').pop();

                hashMap[id] = classReference;
            }, this);

            return hashMap;
        },
        
        /**
         * Fuction that will loop through all application conrollers and create their instances
         * Additionaly, read the list of models and collections from each controller and save the reference within application
         */
        initializeControllers: function(controllers) {
            this.controllers = {};

            _.each(controllers, function(ctrl) {
                var classReference = resolveNamespace(ctrl),
                    id = ctrl.split('.').pop();

                var controller = new classReference({
                    id: id,
                    application: this
                });

                controller.views = this.parseClasses(controller.views || []);

                _.extend(this.models, this.parseClasses(controller.models || []));
                _.extend(this.collections, this.parseClasses(controller.collections || {}));

                this.buildCollections();
                this.controllers[id] = controller;
            }, this);
        },

        /**
         * Launch all controllers using onLauch callback
         */
        launchControllers: function() {
            _.each(this.controllers, function(ctrl, id) {
                ctrl.onLaunch(this);
            }, this);
        },

        /**
         * Abstract fuction that will be called during application lauch
         */
        launch: function() {},

        /**
         * Abstract fuction that will be called during application lauch
         */
        addListeners: function(listeners, controller) {
            this.eventbus.addListeners(listeners, controller)
        },

        /**
         * Getter to retreive link to the particular controller instance
         */
        getController: function(id) {
            return this.controllers[id];
        },

        /**
         * Getter to retreive link to the particular model instance
         * If model instance isn't created, create it
         */
        getModel: function(name) {
            this._modelsCache = this._modelsCache || {};

            var model = this._modelsCache[name],
                modelClass = this.getModelConstructor(name);

            if(!model && modelClass) {
                model = this.createModel(name);
                this._modelsCache[name] = model;
            }

            return model || null;
        },

        /**
         * Getter to retreive link to the particular model consturctor
         */
        getModelConstructor: function(name) {
            return this.models[name];
        },

        /**
         * Function to create new model instance
         */
        createModel: function(name, options) {
            var modelClass = this.getModelConstructor(name),
                options = _.extend(options || {});

            var model = new modelClass(options);

            return model;
        },

        /**
         * Getter to retreive link to the particular collection instance
         * If collection instance isn't created, create it
         */
        getCollection: function(name) {
            this._collectionsCache = this._collectionsCache || {};

            var collection = this._collectionsCache[name],
                collectionClass = this.getCollectionConstructor(name);

            if(!collection && collectionClass) {
                collection = this.createCollection(name);
                this._collectionsCache[name] = collection;
            }

            return collection || null;
        },

        /**
         * Getter to retreive link to the particular collection consturctor
         */	
        getCollectionConstructor: function(name) {
            return this.collections[name];
        },

        /**
         * Function to create new collection instance
         */	
        createCollection: function(name, options) {
            var collectionClass = this.getCollectionConstructor(name),
                options = _.extend(options || {});

            var collection = new collectionClass()

            if(collection.autoLoad === true) {
                collection.load();
            }

            return collection;
        },

        /**
         * Function that will loop throught the list of collection constructors and create instances
         */
        buildCollections: function() {
            _.each(this.collections, function(collection, alias) {
                this.getCollection(alias);
            }, this);
        }
    });


    // Since we are using Backbone let's make sure that there are no conflicts in namespaces
    if(typeof Backbone.Application == 'undefined') {
        Backbone.Application = Application;
    }
    else {
        throw ('Native Backbone.Application instance already defined.')
    }

    var Controller = function(options) {
        _.extend(this, options || {});
        this.initialize.apply(this, arguments);
    };

    _.extend(Controller.prototype, {
        name: null,
        views: {},
        models: {},
        collections: {},

        initialize: function(options) {
        },

        /**
         * Add new listener to the application event bus
         */
        addListeners: function(listeners) {
            this.getApplication().addListeners(listeners, this);
        },

        /**
         * Abstract fuction that will be called during application lauch
         */	
        onLaunch: function(application) {
        },

        /**
         * Getter that will return the reference to the application instance
         */	
        getApplication: function() {
            return this.application;
        },

        /**
         * Getter that will return the reference to the view instance
         */	
        getView: function(name) {
            return this._viewsCache[name];
        },

        /**
         * Getter that will return the reference to the view constructor
         */		
        getViewConstructor: function(name) {
            return this.views[name];
        },

        /**
         * Function to create a new view instance
         * All views are cached within _viewsCache hash map
         */
        createView: function(name, options) {
            var view = this.getViewConstructor(name),
                options = _.extend(options || {}, {
                    alias: name
                });

            this._viewsCache = this._viewsCache || {};

            this._viewsCache[name] = new view(options);

            return this._viewsCache[name]
        },

        /**
         * Delegate method to get model instance reference
         */		
        getModel: function(name) {
            return this.application.getModel(name);
        },

        /**
         * Delegate method to get model constructor reference
         */		
        getModelConstructor: function(name) {
            return this.application.getModelConstructor(name);
        },

        /**
         * Delegate method to create model instance
         */		
        createModel: function(name, options) {
            return this.application.createModel(name)
        },

        /**
         * Delegate method to get collection instance reference
         */		
        getCollection: function(name) {
            return this.application.getCollection(name);
        },

        /**
         * Delegate method to get collection constructor reference
         */		
        getCollectionConstructor: function(name) {
            return this.application.getCollectionConstructor(name);
        },

        /**
         * Delegate method to create collection instance
         */		
        createCollection: function(name, options) {
            return this.application.createCollection(name);
        },

        /**
         * Delegate method to fire event
         */		
        fireEvent: function(selector, event, args) {
            this.application.eventbus.fireEvent(selector, event, args);
        }
    });

    if(typeof Backbone.Controller == 'undefined') {
        Backbone.Controller = Controller;
    }
    else {
        throw ('Native Backbone.Controller instance already defined.')
    }

    var EventBus = function(options) {
        var me = this;

        _.extend(this, options || {});

        _.extend(Backbone.View.prototype, {
            alias: null,
            hidden: false,
            getAlias: function() {
                return this.options.alias;
            },
            /*
             * Instead of calling View.trigger lets use custom function
             * It will notify the EventBus about new event
             */
            fireEvent: function(event, args) {
                this.trigger.apply(this, arguments);
                me.fireEvent(this.getAlias(), event, args);
            },
            hide: function() {
                this.$el.hide();
                this.hidden = true;
            },
            show: function() {
                this.$el.show();
                this.hidden = false;
            }
        });
    };

    _.extend(EventBus.prototype, {
        pool: {},
        /*
        listeners = {
            'view_alias': {
                'event_name': fn
            }
        }
         */
        addListeners: function(selectors, controller) {

            this.pool[controller.id] = this.pool[controller.id] || {};
            var pool = this.pool[controller.id];

            if(_.isArray(selectors)) {
                _.each(selectors, function(selector) {
                    this.addListeners(selector, controller);
                }, this)
            }
            else if(_.isObject(selectors)) {
                _.each(selectors, function(listeners, selector) {
                    _.each(listeners, function(listener, event) {
                        pool[selector] = pool[selector] || {};
                        pool[selector][event] = pool[selector][event] || [];

                        pool[selector][event].push(listener);

                    }, this);
                }, this)

            }
        },

        fireEvent: function(selector, event, args) {
            var application = this.getApplication();

            _.each(this.pool, function(eventsPoolByAlias, controllerId) {
                var events = eventsPoolByAlias[selector];

                if(events) {
                    var listeners = events[event]
                        controller = application.getController(controllerId);

                    _.each(listeners, function(fn) {
                        fn.apply(controller, args);
                    });
                }


            }, this);
        },

        getApplication: function() {
            return this.application;
        }
    });

    Application.extend = Backbone.Model.extend;
    Controller.extend = Backbone.Model.extend;

})();