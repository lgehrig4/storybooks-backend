const express                            = require('express'),
      router                             = express.Router(),
      mongoose                           = require('mongoose'),
      Story                              = mongoose.model('stories'),
      User                               = mongoose.model('users'),
      {ensureAuthenticated, ensureGuest} = require('../helpers/auth');

// Stories Index
router.get('/', (req, res) => {
  Story.find({status: 'public'})
  .populate('user')
  .sort({date: 'desc'})
  .then(stories => {
    res.render('stories/index', {
      stories: stories
    });
  });
});

// Show Single story
router.get('/show/:id', (req, res) => {
  Story.findOne({
    _id: req.params.id
  })
  .populate('user')
  .populate('comments.commentUser')
  .then(story => {
    if (story.status == 'public') {
      res.render('stories/show', {
        story: story
      });
    } else {
      if (req.user) {
        if (req.user.id == story.user._id) {
          res.render('stories/show', {
            story: story
          });
        } else {
          res.redirect('/stories');
        }
      } else {
        res.redirect('/stories');
      }
    }
  });
});

// List stories from a user
router.get('/user/:userId', (req, res) => {
  Story.find({user: req.params.userId, status: 'public'})
  .populate('user')
  .then(stories => {
    res.render('stories/index', {
      stories: stories
    });
  });
});

// Logged in user's Stories
router.get('/my', ensureAuthenticated, (req, res) => {
  Story.find({user: req.user.id, status: 'public'})
  .populate('user')
  .then(stories => {
    res.render('stories/index', {
      stories: stories
    });
  });
});

// Add Story form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('stories/add');
});

// Edit Story form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Story.findOne({
    _id: req.params.id
  })
  .then(story => {
    if (story.user != req.user.id) {
      res.redirect('/stories');
    } else {
      res.render('stories/edit', {
        story: story
      });
    }
  });
});

// Process Add Story
router.post('/', (req, res) => {
  let allowComments;

  if (req.body.allowComments) {
    allowComments = true;
  } else {
    allowComments = false;
  }

  const newStory = {
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    allowComments: allowComments,
    user: req.user.id
  }

  // Create story
  new Story(newStory)
  .save()
  .then(story => {
    res.redirect(`/stories/show/${story.id}`);
  });
});

// Edit Form Process
router.put('/:id', (req, res) => {
  Story.findOne({
    _id: req.params.id
  })
  .then(story => {
    let allowComments;

    if (req.body.allowComments) {
      allowComments = true;
    } else {
      allowComments = false;
    }
    // New values
    story.title = req.body.title ;
    story.body = req.body.body;
    story.status = req.body.status;
    story.allowComments = allowComments;

    story.save()
    .then(story => {
      res.redirect('/dashboard');
    });
  });
});

// Delete story
router.delete('/:id', (req, res) => {
  Story.remove({_id: req.params.id})
  .then(() => {
    res.redirect('/dashboard');
  });
});

// Add Comments
router.post('/comment/:id', (req, res) => {
  Story.findOne({_id: req.params.id})
  .then(story => {
    const newComment = {
      commentBody: req.body.commentBody,
      commentUser: req.user.id
    }
    // add to comments array
    story.comments.unshift(newComment);
    story.save()
    .then(story => {
      res.redirect(`/stories/show/${story.id}`);
    });
  });
});

module.exports = router;
