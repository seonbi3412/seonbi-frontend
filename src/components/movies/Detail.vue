<template>
  <div class="detail container d-flex justify-content-center align-items-center">
    <div class="col-4 text-info">
      <h1>{{ movie.title }}</h1>
      <img :src="poster_url" :alt="movie.title">
    </div>
    <div class="des col-8 d-flex flex-column text-light container">
      <videos class="col-12" :videos="videos"/>
      <h5><star-rating :inline="true" v-model="movie.score" :max-rating="10" :star-size="20" :read-only="true" :increment="0.5"></star-rating> | {{ movie.open_date }}</h5>
      <div class="my-2">
        <span v-for="genre in movie.genres" :key="genre.id" class="m-1">
          <button class="btn text-light" :class="{ 
            'btn-danger': genre.id === 28 || genre.id === 80 || genre.id === 53 || genre.id === 10752,
            'btn-warning': genre.id === 16 || genre.id === 35 || genre.id === 18 || genre.id === 10751 || genre.id === 10749,
            'btn-info': genre.id === 14 || genre.id === 878 || genre.id === 12, 
            'btn-success': genre.id === 99 || genre.id === 36 || genre.id === 10402 || genre.id === 10770 || genre.id === 37,
            'btn-primary': genre.id === 9648 || genre.id === 27 }">
            {{ genre.name }}
          </button>
        </span>
      </div>
      <p class="mb-1"><span class="display-4 text-info">{{ like_count }}</span> 명이 좋아합니다</p>
      <div class="container mt-0 mb-3">
        <button class="btn btn-light" @click="likeMovie" v-if="!isLiked && this.user">
          <font-awesome-icon icon="heart" class="text-secondary"/>
        </button>
        <button class="btn btn-light" @click="likeMovie" v-else-if="this.user"><font-awesome-icon icon="heart" class="text-danger"/></button>
      </div>
      <div class="container rounded-top">
        <p>{{ movie.description }}</p>
      </div>
      <b-container fluid class="p-2 rounded-bottom">
        <b-row>
          <b-col cols="2" v-for="actor in movie.actors" :key="actor.id">
            <router-link :to="`/actors/${actor.id}`">
              <b-img thumbnail fluid v-if="actor.profile_path" :src="`https://image.tmdb.org/t/p/w500${actor.profile_path}`" :alt="actor.name"></b-img>
            </router-link>
          </b-col>
        </b-row>
      </b-container>
    </div>
    <div class="col-4 border border-dark chatbox">
      <div class="reviewChat py-2">
        <div v-for="review in currentReviews" :key="review.id">
          <div v-if="review.movie === movie.id || review.movie_id === movie.id" class="bg-light border border-secondary rounded my-1">
            <p class="mb-0 d-inline">{{ review.content }} - {{ review.user.username }} | </p>
            <star-rating :star-size="10" :inline="true" :read-only="true" v-model="review.score"></star-rating>
          </div>
        </div>
      </div>
      <form @submit.prevent="createReview" class="rounded">
        <b-form-input type="text" v-model="content"></b-form-input>
        <star-rating v-model="rating" :star-size="20" :glow="3" :inline="true"></star-rating>
        <button class="btn btn-info btn-sm mx-3 my-2" type="submit">등록</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import Videos from './Videos.vue'
export default {
  name: "detail",
  data() {
    return {
      currentReviews: [],
      movie: {},
      poster_url: "",
      isLiked: false,
      like_count: 0,
      videos: [],
      content: '',
      rating: 0,
    }
  },
  props: {
    users: {
      type: Array,
      required: true
    },
  },
  components: {
    Videos
  },
  computed: {
    ...mapGetters([
      'options',
      'user'
    ]),
  },
  methods: {
    createReview() {
      const data = {
        'content': this.content,
        'movie': this.movie.id,
        'user': this.user.user_id,
        'score': this.rating,
        'movieName': this.movie.title,
      }
      axios.post(`https://seonbi3412.herokuapp.com/movies/reviews/`, data, this.options)
        .then(response => {
          let tmp_review = response.data
          this.users.forEach(user => {
            if (user.id === tmp_review.user) {
              tmp_review.user = user
            }
          })
          this.currentReviews.push(tmp_review)
          console.log(tmp_review)
          this.content = ''
          this.rating = 0
          this.$emit('redataload', true)
        })
        .catch(error => {
          console.log(error)
        })
    },
    likeMovie() {
      axios.post(`https://seonbi3412.herokuapp.com/movies/${this.movie.id}/like/`, this.user, this.options)
        .then(response => {
          this.movie = response.data
          this.like_count = this.movie.like_users.length
          this.poster_url=`https://image.tmdb.org/t/p/w300${this.movie.poster_url}`
          this.isLiked = false
          for(let idx in this.movie.like_users){
            if (this.movie.like_users[idx].id === this.user.user_id){
              this.isLiked = true
              break
            }
          }
          this.$emit('redataload', true)
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
  mounted() {
    axios.get(`https://seonbi3412.herokuapp.com/movies/${this.$route.params.id}/reviews/`)
      .then(response => {
        console.log('======================== ')
        console.log(response)
        this.currentReviews = response.data
        this.currentReviews.forEach(review => {
          this.users.forEach(user => {
            if (review.user === user.id) {
              review.user = user
            }
          })
        })
      })
    axios.get(`https://seonbi3412.herokuapp.com/movies/${this.$route.params.id}/`)
      .then(response => {
        this.movie = response.data
        this.like_count = this.movie.like_users.length
        this.poster_url=`https://image.tmdb.org/t/p/w300${this.movie.poster_url}`
        this.isLiked = false
          for(let idx in this.movie.like_users){
            if (this.movie.like_users[idx].id === this.user.user_id){
              this.isLiked = true
              break
            }
          }
        return this.movie
      })
      .then(movie => {
        axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=6b356c5ae179a5d932c01687a436b72e&language=ko-KR`)
          .then(response => {
            this.videos = response.data.results
          })
          .catch(error => {
            console.log(error)
          })
      })
      .catch(error => {
        console.log(error)
      })
  }
}
</script>

<style>
div.detail {
  width: 3000px;
  height: 100vh;
}
div.reviewChat {
  height: 80vh;
  border-radius: 15px;
  overflow-y: scroll;
  -ms-overflow-style: none;
}
.chatbox {
  border-radius: 10px;
  box-shadow:
        0 0 10px 5px #fff,  /* inner white */
        0 0 20px 16px rgb(53, 55, 185), /* middle magenta */
        0 0 25px 15px rgb(210, 67, 223); /* outer cyan */
}
::-webkit-scrollbar {
  display:none;
}
</style>