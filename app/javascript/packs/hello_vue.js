/* eslint no-console: 0 */
// Run this example by adding <%= javascript_pack_tag 'hello_vue' %>
// to the head of your layout file,
// like app/views/layouts/application.html.erb.
// All it does is render <div>Hello Vue</div> at the bottom of the page.

import Vue from 'vue/dist/vue.esm'
import TurbolinksAdapter from 'vue-turbolinks'
import VueResource from 'vue-resource'

Vue.use(VueResource)

document.addEventListener('turbolinks:load', () => {
  Vue.http.headers.common['X-CSRF-Token'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

  var element = document.getElementById("team-form")
  if (element != null) {

    var id = element.dataset.id
    var team = JSON.parse(element.dataset.team)
    var players_attributes = JSON.parse(element.dataset.playersAttributes)
    players_attributes.forEach(function(player) { player._destroy = null })
    team.players_attributes = players_attributes

    var app = new Vue({
      el: element,
      mixins: [TurbolinksAdapter],
      data: function() {
        return { id: id, team: team }
      },
      methods: {
        addPlayer: function() {
          this.team.players_attributes.push({
            id: null,
            name: "",
            //position: "",
            _destroy: null
          })
        },

        removePlayer: function(index) {
          var player = this.team.players_attributes[index]

          if (player.id == null) {
            this.team.players_attributes.splice(index, 1)
          } else {
            this.team.players_attributes[index]._destroy = "1"
          }
        },

        undoRemove: function(index) {
          this.team.players_attributes[index]._destroy = null
        },

        saveTeam: function() {
          // Create a new team
          if (this.id == null) {
            this.$http.post('/teams', { team: this.team }).then(response => {
              Turbolinks.visit(`/teams/${response.body.id}`)
            }, response => {
              console.log(response)
            })

          // Edit an existing team
          } else {
            this.$http.put(`/teams/${this.id}`, { team: this.team }).then(response => {
              Turbolinks.visit(`/teams/${response.body.id}`)
            }, response => {
              console.log(response)
            })
          }
        },

        existingTeam: function() {
          return this.team.id != null
        }

      }
    })

  }
})
