import { mount } from 'avoriaz'
import Modal from '@/components/modal/Modal.vue'
import { commentsModule } from '../../../src/vuex/store';
import Vuex from 'vuex';
import Vue from 'vue';
Vue.use(Vuex)
import _ from 'lodash';

describe('Modal.vue', () => {
  let commentsModuleStubbed;
  beforeEach(() => {
    commentsModuleStubbed = _.cloneDeep(commentsModule)
    commentsModuleStubbed.state.comments = [
      {
        'id': 5,
        'likes': 5,
        'comments': [
          {
            'author': 'charlotte',
            'text': 'Кажется, селфи - это не твое :('
          }
        ]
      }
    ]
  })

  it('init likes count', (done) => {
    const stubbedStore = new Vuex.Store(commentsModuleStubbed);
    const vm = mount(Modal, {
      store: stubbedStore,
      propsData: {
        current: 5
      }
    });


    Vue.nextTick()
     .then(function () {
          console.log(vm.data().test)
         done()
       })
       .catch(done)

  })


})
