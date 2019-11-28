<template>
  <div id="app" class="text-dark">
    <div v-if="!this.$route.path.includes('/account/login') && !this.$route.path.includes('/account/signup')">
      <Nav :genres="genres" :movies="movies" :users="users" :actors="actors" :reviews="reviews" @redataload="loadDBdata"/>
    </div>
    <router-view :genres="genres" :movies="movies" :users="users" :actors="actors" :reviews="reviews" :reMovies="reMovies" :boxoffice="boxoffice" @redataload="loadDBdata"/>
    <font-awesome-icon icon="user-secret" />
  </div>
</template>

<script>
// @ is an alias to /src
import Nav from './views/Nav.vue'
import { mapGetters } from 'vuex'
import axios from 'axios'

export default {
  name: 'app',
  components: {
    Nav
  },
  data() {
    return {
      movies: [],
      genres: [],
      users: [],
      actors: [],
      reviews: [],
      reMovies: [],
      boxoffice: [],
    }
  },
  computed: {
    ...mapGetters([
      'options',
      'user'
    ])
  },
  methods: {
    isLogin() {
      this.$session.start()
      if (this.$session.has('jwt')) {
        this.$store.dispatch('login', this.$session.get('jwt'))
      }
    },
    loadDBdata() {
      axios.get(`https://seonbi3412.herokuapp.com/movies/`)
        .then(response =>{
          this.movies = response.data
          
          axios.get('http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=20ea3580299a37f479eee8e01bc91ded&targetDt=20191125&itemPerPage=10')
            .then(response => {
              console.log(response.data.boxOfficeResult.dailyBoxOfficeList)
              this.boxoffice = response.data.boxOfficeResult.dailyBoxOfficeList
              this.boxoffice = this.boxoffice.map(box => {
                let mov = this.movies.filter(movie => {
                  return box.movieNm === movie.title
                })
                return {...box, poster_url: mov.length > 0 ? mov[0].poster_url : ''}
              })
              console.log(this.boxoffice)
            })
            .catch(error => {
              console.log(error)
            })
        })
        .catch(error => {
          console.log(error)
        })

      axios.get(`https://seonbi3412.herokuapp.com/movies/genres/`)
        .then(response =>{
          this.genres = response.data
        })
        .catch(error => {
          console.log(error)
        })

      axios.get(`https://seonbi3412.herokuapp.com/movies/users/`)
        .then(response =>{
          this.users = response.data

          let data = {
            'user': -1
          }
          if(this.user.user_id > 0){
            // console.log(this.users)
            data = {
              'user': this.users[this.user.user_id-1]
            }
          }

          console.log(data)

          axios.post(`https://seonbi3412.herokuapp.com/movies/recommend/`, data)
            .then(response => {
              console.log(response)
              this.reMovies = response.data
            })
            .catch(error => {
              console.log(error)
            })

        })
        .catch(error => {
          console.log(error)
        }),
      axios.get(`https://seonbi3412.herokuapp.com/movies/actors/`)
        .then(response =>{
          this.actors = response.data
        })
        .catch(error => {
          console.log(error)
        })

      axios.get(`https://seonbi3412.herokuapp.com/movies/reviews/`)
        .then(response =>{
          this.reviews = response.data.map(data => {
            return {...data, updated: false}
          })
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
  mounted() {
    this.loadDBdata()
  },
}
</script>

<style>
@import url(//fonts.googleapis.com/earlyaccess/hanna.css);
/* @import url(//db.onlinewebfonts.com/c/48e8fdcae584b7ce6ca765d7ddda0874?family=Komika+Boogie); */
@font-face { font-family: 'BMJUA'; src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/BMJUA.woff') format('woff'); font-weight: normal; font-style: normal; }

#app {
  font-family: 'Hanna', fantasy, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
body {
  background-image: url('./assets/bg.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;  
}
</style>