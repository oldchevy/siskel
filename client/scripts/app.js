var Movie = Backbone.Model.extend({

  defaults: {
    like: true
  },

  toggleLike: function() {
    this.set('like', !this.get('like'));
  }

});

var Movies = Backbone.Collection.extend({

  model: Movie,

  //this initialize operates on every model in the collection,
  //not the collection itself!
  initialize: function() {
    //Thus this event listener is saying we must sort when an attribute is changed
    //eg: we are currently sorting by like, so when a like is registered we will
    //re-sort immediately
    this.on('change', this.sort, this);

  },

  comparator: 'title',

  sortByField: function(field) {
    this.comparator = field;
    //We know it needs to re-sort when the comparator changes
    //Without a change, additions are automatically sorted into the collection
    this.sort();
  }

});

var AppView = Backbone.View.extend({

  events: {
    'click form input': 'handleClick'
  },

  handleClick: function(e) {
    var field = $(e.target).val();
    this.collection.sortByField(field);
  },

  render: function() {
    new MoviesView({
      el: this.$('#movies'),
      collection: this.collection
    }).render();
  }

});

var MovieView = Backbone.View.extend({

  template: _.template('<div class="movie"> \
                          <div class="like"> \
                            <button><img src="images/<%- like ? \'up\' : \'down\' %>.jpg"></button> \
                          </div> \
                          <span class="title"><%- title %></span> \
                          <span class="year">(<%- year %>)</span> \
                          <div class="rating">Fan rating: <%- rating %> of 10</div> \
                        </div>'),

  //Must call in the context of the View, not the views model.
  //Otherwise the reference to this.render is to the model
  initialize: function() {
    this.model.on('change', this.render, this);
  },

  events: {
    'click button': 'handleClick'
  },

  //Event handler is already attached through events property!
  handleClick: function() {
    this.model.toggleLike();
  },

  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this.$el;
  }

});

var MoviesView = Backbone.View.extend({

  initialize: function() {
    //Listener for whether the collection was just resorted
    //Then we need to re-render
    this.collection.on('sort', this.render, this);
  },

  render: function() {
    this.$el.empty();
    this.collection.forEach(this.renderMovie, this);
  },

  renderMovie: function(movie) {
    var movieView = new MovieView({model: movie});
    this.$el.append(movieView.render());
  }

});
