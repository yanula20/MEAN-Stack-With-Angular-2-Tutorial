var User = require('../models/user');
var Blog = require('../models/blog');
var jwt = require('jsonwebtoken');
var config = require('../config/database');

module.exports = function (router) {
  router.post('/newBlog', function (req, res) {
    if (!req.body.title) {
      res.json({
        success: false,
        message: 'Blog title is required.',
      });
    } else {
      if (!req.body.body) {
        res.json({
          success: false,
          message: "Blog body is required.",
        });
      } else {
        if (!req.body.createdBy) {
          res.json({
            success: false,
            message: "CreatedBy is required.",
          });
        } else {
          var blog = new Blog({
            title: req.body.title,
            body: req.body.body,
            createdBy: req.body.createdBy,
          });
          blog.save(function (err) {
            // Check if error
            if (err) {
              // Check if error is a validation error
              if (err.errors) {
                // Check if validation error is in the title field
                if (err.errors.title) {
                  res.json({
                    success: false,
                    message: err.errors.title.message,
                  }); // Return error message
                } else {
                  // Check if validation error is in the body field
                  if (err.errors.body) {
                    res.json({
                      success: false,
                      message: err.errors.body.message,
                    }); // Return error message
                  } else {
                    res.json({
                      success: false,
                      message: err,
                    }); // Return general error message
                  }
                }
              } else {
                res.json({
                  success: false,
                  message: err,
                }); // Return general error message
              }
            } else {
              res.json({
                success: true,
                message: 'Blog saved!',
              }); // Return success message
            }
          });
        } //17
      } //14
    } //11
  }); //router.post
  // -1, descending order
  router.get('/allBlogs', function (req, res) {
    Blog.find({}, function (err, blogs) {
      if (err) {
        res.json({
          success: false,
          message: err,
        });
      } else {
        if (!blogs) {
          res.json({
            success: false,
            message: 'No blogs found.',
          });
        } else {
          res.json({
            success: true,
            blogs: blogs,
          });
        }
      }
    }).sort({
      '_id': -1,
    });
  });

  router.get('/singleBlog/:id', function (req, res) {
    if (!req.params.id) {
      res.json({
        success: false,
        message: 'No blog id was provided.',
      });
    } else {
      Blog.findOne({
        _id: req.params.id,
      }, (err, blog) => {
        if (err) {
          res.json({
            success: false,
            message: 'Not a valid blog id.',
          });
        } else {
          if (!blog) {
            res.json({
              success: false,
              message: 'Blog not found.',
            });
          } else {
            User.findOne({
              _id: req.decoded.userId
            }, (err, user) => {
              if (err) {
                res.json({
                  success: false,
                  message: err
                });
              } else {
                if (!user) {
                  res.json({
                    success: false,
                    message: "Unable to authenticate user."
                  });
                } else {
                  if (user.username !== blog.createdBy) {
                    res.json({
                      success: false,
                      message: "You are not authorized to edit this item."
                    })
                  } else {
                    res.json({
                      success: true,
                      blog: blog
                    });
                  }

                }
              }

            });
          }
        }
      });
    }
  });


  router.put('/updateBlog', function(req, res) {
    if (!req.body._id) {
      res.json({
        success: false,
        message: "No blog id provided."
      });
    } else {
      Blog.findOne({
        _id: req.body._id
      }, (err, blog) => {
        if (err) {
          res.json({
            success: false,
            message: "Not a valid blog id."
          });
        } else {
          if (!blog) {
            res.json({
              success: false,
              message: "Blog id not found."
            });
          } else {
            User.findOne({
              _id: req.decoded.userId
            }, (err, user) => {
              if (err) {
                res.json({
                  success: false,
                  message: err
                });
              } else {
                if (!user) {
                  res.json({
                    success: false,
                    message: "Unable to authenticate the user."
                  });
                } else {
                  if (user.username !== blog.createdBy) {
                    res.json({
                      success: false,
                      message: 'You are not authorized to edit this item.',
                    });
                  } else {
                    blog.title = req.body.title;
                    blog.body = req.body.body;
                    blog.save((err) => {
                      if (err) {
                        res.json({
                          success: false,
                          message: err,
                        });
                      } else {
                        res.json({
                          success: true,
                          message: 'Blog updates saved!',
                        });
                      }
                    });
                  }
                }
              }
            });
          }
        }
      });
    }
  });

  router.delete('/deleteBlog/:id', (req, res) => {
    if (!req.params.id) {
      res.json({
        success: false,
        message: "No blog id was provided."
      });
    } else {
      Blog.findOne({
        _id: req.params.id
      }, (err, blog) => {
        if (err) {
          res.json({
            success: false,
            message: "Invalid Id."
          });
        } else {
          if (!blog) {
            res.json({
              success: false,
              message: "No blog was found."
            });
          } else {
            User.findOne({
              _id: req.decoded.userId
            }, (err, user) => {
              if (err) {
                res.json({
                  success: false,
                  message: err
                });
              } else {
                if (!user) {
                  res.json({
                    success: false,
                    message: "User could not be authenticated."
                  });
                } else {
                  if (user.username !== blog.createdBy) {
                    res.json({
                      success: false,
                      message: "You are not authorized to delete this item."
                    });
                  } else {
                    blog.remove((err) => {
                      if (err) {
                        res.json({
                          success: false,
                          message: err
                        });
                      } else {
                        res.json({
                          success: true,
                          message: "Blog Deleted!"
                        });
                      }
                    });
                  }
                }
              }
            });
          }
        }
      });
    }

  });

  router.put('/likeBlog', function(req, res) {
    if (!req.body.id) {
      res.json({
        success: false,
        message: 'No blog id was provided.',
      });
    } else {
      Blog.findOne({
        _id: req.body.id,
      }, (err, blog) => {
        if (err) {
          res.json({
            success: false,
            message: 'Blog id is invalid.',
          });
        } else {
          if (!blog) {
            res.json({
              success: false,
              message: 'Blog was not found.',
            });
          } else {
            User.findOne({
              _id: req.decoded.userId
            }, (err, user) => {
              if (err) {
                res.json({
                  success: false,
                  message: "Something went wrong."
                });
              } else {
                if (!user) {
                  res.json({
                    success: false,
                    message: "User could not be authenticated."
                  });
                } else {
                  if (user.username === blog.createdBy) {
                    res.json({
                      success: false,
                      message: "Cannot like your own post!"
                    });
                  } else {
                    if (blog.likedBy.includes(user.username)) {
                      res.json({
                        success: false,
                        message: "You already liked this post."
                      });
                    } else {
                      if (blog.dislikedBy.includes(user.username)) {
                        blog.dislikes--;
                        var arrayIndex = blog.dislikedBy.indexOf(user.username);
                        blog.dislikedBy.splice(arrayIndex, 1);
                        blog.likes++;
                        blog.likedBy.push(user.username);
                        blog.save((err) => {
                          if (err) {
                            res.json({
                              success: false,
                              message: "Something went wrong."
                            });
                          } else {
                            res.json({
                              success: true,
                              message: "Blog liked!"
                            });
                          }
                        });
                      } else {
                        blog.likes++;
                        blog.likedBy.push(user.username);
                        blog.save((err) => {
                          if (err) {
                            res.json({
                              success: false,
                              message: "Something went wrong."
                            });
                          } else {
                            res.json({
                              success: true,
                              message: "Blog liked!"
                            });
                          }
                        });
                      }
                    }
                  }
                }
              }
            });
          }
        }
      });
    }
  });

  router.put('/dislikeBlog', function(req, res) {
    if (!req.body.id) {
      res.json({
        success: false,
        message: "No blog id was provided."
      });
    } else {
      Blog.findOne({
        _id: req.body.id
      }, (err, blog) => {
        if (err) {
          res.json({
            success: false,
            message: "Blog id is invalid."
          });
        } else {
          if (!blog) {
            res.json({
              success: false,
              message: "Blog was not found."
            });
          } else {
            User.findOne({
              _id: req.decoded.userId
            }, (err, user) => {
              if (err) {
                res.json({
                  success: false,
                  message: "Something went wrong."
                });
              } else {
                if (!user) {
                  res.json({
                    success: false,
                    message: "User could not be authenticated."
                  });
                } else {
                  if (user.username === blog.createdBy) {
                    res.json({
                      success: false,
                      message: "Cannot dislike your own post!"
                    });
                  } else {
                    if (blog.dislikedBy.includes(user.username)) {
                      res.json({
                        success: false,
                        message: "You already disliked this post."
                      });
                    } else {
                      if (blog.likedBy.includes(user.username)) {
                        blog.likes--;
                        var arrayIndex = blog.likedBy.indexOf(user.username);
                        blog.likedBy.splice(arrayIndex, 1);
                        blog.dislikes++;
                        blog.dislikedBy.push(user.username);
                        blog.save((err) => {
                          if (err) {
                            res.json({
                              success: false,
                              message: "Something went wrong."
                            });
                          } else {
                            res.json({
                              success: true,
                              message: "Blog disliked!"
                            });
                          }
                        });
                      } else {
                        blog.dislikes++;
                        blog.dislikedBy.push(user.username);
                        blog.save((err) => {
                          if (err) {
                            res.json({
                              success: false,
                              message: 'Something went wrong.'
                            });
                          } else {
                            res.json({
                              success: true,
                              message: "Blog disliked!"
                            });
                          }
                        });
                      }
                    }
                  }
                }
              }
            });
          }
        }
      });
    }
  });


  return router;

}; //module.exports
