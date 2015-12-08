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
      children: [E('div',  {
        className: 'btn btn-default',
        textContent: 'Logout',
        style: {
          marginTop: '15px',
          marginRight: '15px'
        },
        onclick: function() {
          ajax.post('logout').then(function() {
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

    var source;
    if (app.user.is_instructor) {
      source = 'projects/mine';

      E('div', {
        className: 'btn btn-default',
        textContent: 'Create',
        onclick: function() {
          editProject(null);
        },
        parent: section
      });
    } else {
      source = 'projects/available';
    }

    ajax.get(source).then(function(projects) {
      projects.forEach(function (project) {
        var panel = E('div', {
          className: 'panel panel-primary',
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

        if (app.user.is_instructor) {
          E('div', {
            className: 'btn btn-default',
            textContent: 'Edit',
            onclick: function() {
              editProject(project);
            },
            parent: heading
          });

          E('div', {
            className: 'btn btn-default',
            textContent: 'Delete',
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

        E('p', {
          children: [E('b', {
            textContent: 'Teams: '
          })],
          parent: body
        });

        teams(body, project);
      });
    });
  }

  function editProject(project) {
    var modal = new Modal({
      title: project ? 'Edit' : 'Create' + ' Project'
    });

    form({
      action: 'project',
      method: project ? 'post' : 'put',
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
        label: project ? 'Save' : 'Create',
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

    E('div', {
      className: 'btn btn-default',
      textContent: 'Create Team',
      onclick: function() {
        editTeam({
          project_id: project.id
        });
      },
      parent: section
    });

    E('div', {
      className: 'btn btn-default',
      textContent: 'Edit Team',
      onclick: function() {
        editTeam({
          name: 'Test'
        });
      },
      parent: section
    });

    E('div', {
      className: 'btn btn-default',
      textContent: 'Join Team',
      onclick: function() {
        ajax.post('team/join').then(function(response) {
          console.log(response);
        });
      },
      parent: section
    });

    E('div', {
      className: 'btn btn-default',
      textContent: 'Leave Team',
      onclick: function() {
        ajax.post('team/leave').then(function(response) {
          console.log(response);
        });
      },
      parent: section
    });

    ajax.get('teams', {
      project_id: project.id
    }).then(function(teams) {
      teams.forEach(function (team) {
        var panel = E('div', {
          className: 'panel panel-primary',
          parent: section
        });

        E('div', {
          className: 'panel-heading',
          children: [E('h2', {
            className: 'panel-title',
            textContent: team.name + ' - ' + team.liason_id
          })],
          parent: panel
        })

        E('div', {
          className: 'panel-body',
          textContent: 'test',
          parent: panel
        });
      });
    });
  }

  function editTeam(team) {
    var modal = new Modal({
      title: team ? 'Edit' : 'Create' + ' Team'
    });

    form({
      action: 'team',
      method: team ? 'post' : 'put',
      defaults: team,
      inputs: [{
        param: 'name',
        label: 'Name'
      }],
      submit: {
        label: team ? 'Save' : 'Create',
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
