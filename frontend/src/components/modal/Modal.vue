<template>
  <div class="overlay" v-if="isOpen" @click="closePopup($event)">
    <div class="popup">
      <div class="popup__inner">
        <img v-if="pics > 1" src="../../assets/icons/arrow-left.png" class="arrow" @click="moveLeft()">
        <div class="popup__img-wrapper">
          <img class="popup__img" :src="imgSrc">
          <div class="like">
            <img class="like__img" src="../../assets/icons/pawprint-gray.svg" @click="like()">
            <div class="like__numbers">{{likes}}</div>
          </div>
        </div>
        <img v-if="pics > 1" src="../../assets/icons/arrow-right.png" class="arrow" @click="moveRight()">
      </div>
      <div class="comments">
        <div class="comment" v-for="item in comments">
          <img class="comment__img" :src="getAvatarSrc(item.author)"/>
          <p class="comment__text">{{item.text}}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .overlay {
    width:100%;
    min-height:100%;
    background-color: rgba(0,0,0,0.5);
    overflow:hidden;
    position:fixed;
    top:0;
    left: 0;
    text-align: center;
  }
  .popup {
    min-width:80px;
    max-width: 500px;
    height:350px;
    background: rgba(255, 255, 255, 0.9);
    align-items: center;
    justify-content: flex-start;
    flex-direction: column;
    display: inline-flex;
    margin: 10px auto;
    width: 455px;
  }
  .popup__inner {
    align-items: center;
    justify-content: space-between;
    display: flex;
    height: 245px;
    margin-top: 5px;
    width: 100%;
  }
  .popup__img-wrapper {
    display: inline-flex;
    flex-direction: column;
    margin: 0 10px;
  }
  .popup__img {
    max-height: 220px;
  }
  .like {
    display: flex;
    margin-top: 5px;
  }
  .like__img {
    width: 12px;
    height: 12px;
  }
  .like__numbers {
    color: gray;
    font-size: 12px;
    margin-left: 3px;
    vertical-align: top;
  }
  .arrow {
    width: 20px;
    height: 35px;
    &:hover {
      transform: scale(1.1, 1.1);
    }
  }
  .comments {
    width: 100%;
    padding: 3px 32px;
  }
  .comment {
    display: flex;
    width: 100%;
  }
  .comment__img {
    width: 30px;
    height: 30px;
    border-radius: 100%;
  }

  .comment__text {
    padding-left: 5px;
    font-size: 12px;
    line-height: 1;
  }
</style>
<script>
  import api from '../../api/index'
  import { likePhoto } from '../../vuex/store'
  import { getComments } from '../../vuex/store'
  export default {
    name: 'modal',
    props: ['alias', 'current', 'pics', 'isOpen'],
    data () {
      return {
        currentImg: this.current,
        likes: 0,
        comments: {
          author: '',
          test: ''
        }
      }
    },
    created () {
      if (!this.$store.getters.comments.length) {
        getComments(this.alias)
          .then(() => {
            this.setCommentsData()
          })
          .catch(() => {
            throw new Exception('getting comments error')
          })
      } else {
          this.setCommentsData()
      }
    },
    computed: {
      imgSrc: function () {
         return `${api.images}${this.alias}/${this.currentImg}.jpg`
      }
    },
    methods: {
      moveRight() {
        if (this.currentImg < this.pics - 1) {
          this.currentImg++;
        } else {
          this.currentImg = 0;
        }
        this.setCommentsData();
      },
      moveLeft() {
        if (this.currentImg !== 0) {
          this.currentImg--;
        } else {
          this.currentImg = this.pics - 1;
        }
        this.setCommentsData();
      },
      closePopup(e) {
        if (e.target.classList.contains('overlay')) {
          this.$emit('close-modal');
        }
      },
      getAvatarSrc(alias) {
         return api.images + alias + '/0.jpg';
      },
      like() {
        likePhoto(this.currentImg);
        this.setCommentsData();
      },
      setCommentsData() {
        if (!this.$store.getters.comments.find(item => item.id === this.currentImg)) return;
        this.likes = this.$store.getters.comments.find(item => item.id === this.currentImg).likes;
        this.comments = this.$store.getters.comments.find(item => item.id === this.currentImg).comments;
      }
    },
    watch: {
      current: function () {
        this.currentImg = this.current;
        this.setCommentsData();
      }
    }
  }
</script>
