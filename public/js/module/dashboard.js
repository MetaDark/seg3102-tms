'use strict';

app.module(function(E, ajax) {
  var module = {
    css: ['css/module/dashboard.css']
  };

  module.display = function(container) {
    navbar(container);

    var body = E('div', {
      className: 'modal-body',
      parent: container
    });

    projects(body);
  };

  function navbar(container) {
    var navbar = E('nav', {
      className: 'navbar navbar-inverse',
      parent: container
    });

    var header = E('div', {
      className: 'navbar-header',
      children: [E('div', {
        className: 'navbar-brand',
        textContent: 'TMS'
      })],
      parent: navbar
    });

    var collapse = E('div', {
      className: 'collapse navbar-collapse',
      parent: navbar
    });

    var nav = E('ul', {
      className: 'nav navbar-nav',
      parent: collapse
    });

    E('li', {
      className: 'active',
      children: [E('a', {
        href: '#dashboard',
        textContent: 'Dashboard'
      })],
      parent: nav
    });

    var controls = E('ul', {
      className: 'nav navbar-nav navbar-right',
      parent: collapse
    });

    E('li', {
      children: [E('button',  {
        className: 'btn btn-default',
        textContent: 'Logout',
        style: {
          marginTop: '15px',
          marginRight: '15px'
        },
        onclick: function() {
          ajax.post('logout').then(function() {
            delete app.user;
            app.load('login');
          });
        }
      })],
      parent: controls
    });
  }

  function projects(container) {
    var section = E('div', {
      parent: container
    });

    if (app.user.is_instructor) {
      E('button', {
        className: 'btn btn-default',
        textContent: 'Create Project',
        onclick: function() {
          editProject({});
        },
        parent: section
      });
    }

    ajax.get('projects').then(function(projects) {
      if (projects.length === 0) {
        E('p', {
          textContent: 'No projects exist',
          parent: container
        });
      }
      
      projects.forEach(function (project) {
        var panel = E('div', {
          className: 'panel panel-primary project',
          parent: section
        });

        var heading = E('div', {
          className: 'panel-heading',
          children: [E('h2', {
            className: 'panel-title',
            textContent: project.name
          })],
          parent: panel
        });

        E('button', {
          className: 'btn btn-default',
          textContent: 'Create Team',
          onclick: function() {
            editTeam({
              project_id: project.id
            });
          },
          parent: heading
        });
        
        if (app.user.is_instructor) {
          E('button', {
            className: 'btn btn-default',
            textContent: 'Edit',
            onclick: function() {
              editProject(project);
            },
            parent: heading
          });

          E('button', {
            className: 'btn btn-default',
            textContent: 'Delete',
            onclick: function() {
              ajax.delete('project', {
                id: project.id
              }).then(function() {
                app.reload();
              });
            },
            parent: heading
          });
        }

        var body = E('div', {
          className: 'panel-body',
          parent: panel
        });

        E('p', {
          children: [E('b', {
            textContent: 'Description: '
          }), project.description],
          parent: body
        });

        var teamSize = project.min_team_size !== project.max_team_size ?
              project.min_team_size + ' - ' + project.max_team_size :
              project.max_team_size;
        teamSize += ' members';

        E('p', {
          children: [E('b', {
            textContent: 'Team Size: '
          }), teamSize],
          parent: body
        });

        E('hr', {
          parent: body
        });

        teams(body, project);
      });
    });
  }

  function editProject(project) {
    var modal = new Modal({
      title: (project.id ? 'Edit' : 'Create') + ' Project'
    });

    form({
      action: 'project',
      method: project.id ? 'post' : 'put',
      defaults: project,
      inputs: [{
        param: 'name',
        label: 'Name'
      }, {
        param: 'description',
        label: 'Description',
        type: 'textarea'
      }, {
        param: 'min_team_size',
        label: 'Minimum Team Size',
        type: 'number'
      }, {
        param: 'max_team_size',
        label: 'Maximum Team Size',
        type: 'number'
      }],
      submit: {
        label: project.id ? 'Save' : 'Create',
        then: function() {
          app.reload();
          modal.close()
        }
      },
      parent: modal.body
    });

    modal.open();
  }

  function teams(container, project) {
    var section = E('div', {
      parent: container
    });

    ajax.get('teams/project', {
      project_id: project.id  
    }).then(function(teams) {
      var currentTeam = null;
      teams.forEach(function(team) {
        if (currentTeam) return;
        
        if (team.liason_id === app.user.id) {
          currentTeam = team;
        } else {
          team.members.some(function(member) {
            if (member.id === app.user.id) {
              currentTeam = team;
            }
          });
        }
      });

      if (teams.length === 0) {
        E('p', {
          textContent: 'No teams',
          parent: container
        });
      }
      
      teams.forEach(function (team) {
        var isMember = team.members.some(function(member) {
          return member.id === app.user.id;
        });
        
        var panel = E('div', {
          className: 'panel panel-primary team',
          parent: section
        });

        var heading = E('div', {
          className: 'panel-heading',
          children: [E('h2', {
            className: 'panel-title',
            textContent: team.name
          })],
          parent: panel
        });

        // Allow liasons and instructors to edit their teams
        if (app.user.is_instructor || app.user.id === team.liason_id) {
          E('button', {
            className: 'btn btn-default',
            textContent: 'Edit',
            onclick: function() {
              editTeam(team);
            },
            parent: heading
          });

          E('button', {
            className: 'btn btn-default',
            textContent: 'Delete',
            onclick: function() {
              ajax.delete('team', {
                id: team.id
              }).then(function() {
                app.reload();
              });            
            },
            parent: heading
          });

        // Only allow a user to join / leave a team if they are not a liason
        } else {
          E('button', {
            className: 'btn btn-default',
            textContent: isMember ? 'Leave' : 'Join',
            onclick: function() {
              if (currentTeam) {
                // new Modal({
                //   title: 'Leave ' + currentTeam.name + '?',
                //   children: [E('')]
                // }).open();
              }
              var action = isMember ? 'delete' : 'put';
              ajax[action]('team_member', {
                team_id: team.id
              }).then(function() {
                app.reload();
              });
            },
            parent: heading
          });
        }

        E('div', {
          className: 'panel-body',
          children: [E('b', {
            textContent: 'Liason: '
          }), team.liason_id],
          parent: panel
        });
      });
    });
  }

  function editTeam(team) {
    var modal = new Modal({
      title: (team.id ? 'Edit' : 'Create') + ' Team'
    });

    form({
      action: 'team',
      method: team.id ? 'post' : 'put',
      defaults: team,
      inputs: [{
        param: 'name',
        label: 'Name'
      }],
      submit: {
        label: team.id ? 'Save' : 'Create',
        then: function() {
          app.reload();
          modal.close()
        }
      },
      parent: modal.body
    });

    modal.open();
  }

  return module;
});
