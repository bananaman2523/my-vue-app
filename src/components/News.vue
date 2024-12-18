<template>
  <div class="news-container">
    <h1 class="news-title">News<hr></h1>
    <div class="news-grid">
      <div v-for="(newsItem, index) in visibleNews" :key="index" class="new-card">
        <div class="image-container">
          <img :src="getAssetURL(newsItem.image)" :alt="newsItem.title" class="new-image" />
          <a :href="newsItem.reference" target="_blank" class="new-title-link">
            <h3 class="new-title">{{ newsItem.translations[0].title }}</h3>
          </a>
        </div>
        <div class="new-content">
          <p class="new-description">{{ newsItem.translations[0].description }}</p>
          <div class="bottom-content">
            <p class="new-date">{{ newsItem.date }}</p>

            <div style="display: flex;">
              <p class="new-ref">Reference</p>
              <div class="images-circles">
                  <img v-for="(icon, index) in newsItem.icon_ref" :key="index" :src="getAssetURL(icon.directus_files_id)" :alt="icon.title" class="circle-image" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button v-if="news.length > visibleCount" class="load-more-button" @click="toggleVisibility">
      <span>{{ showAll ? 'Less' : 'More' }}</span>
      <i :class="showAll ? 'arrow-up' : 'arrow-down'"></i>
    </button>

  </div>
</template>

<script>
import { directus } from "@/services/directus";
import { getAssetURL } from "@/services/get-asset-url";
import { format } from "date-fns";
import { readItems } from "@directus/sdk";

export default {
  name: "NewsGrid",
  data() {
    return {
      news: [],
      visibleCount: 6,
      showAll: false,
    };
  },
  computed: {
    visibleNews() {
      return this.showAll ? this.news : this.news.slice(0, this.visibleCount);
    },
  },
  methods: {
    async fetchData() {
      try {

        const response = await directus.request(
          readItems('news_page', {
            deep: {
              translations: {
                _filter: {
                  _and: [
                    {
                      languages_code: { _eq: 'en-US' },
                    },
                  ],
                },
              },
            },
            fields: ['id', 'title', 'description', 'date', 'reference', 'line_count', 'status', 'image', 'icon_ref.*', 'translations.*'],
            filter: {
              status : {
                _eq : 'publish'
              }
            } 
          }));
          console.log(response);
          
        if (response) {
          this.news = response.map((news) => ({
            ...news,
            date: this.formatDate(news.date),
          }));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    toggleVisibility() {
      this.showAll = !this.showAll;
    },
    getAssetURL,
    formatDate(dateString) {
      const date = new Date(dateString);
      return format(date, "dd MMMM yyyy");
    },
  },
  async mounted() {
    await this.fetchData();
  },
};
</script>


<style scoped>
.image-container {
  position: relative;
}

.new-title {
  position: absolute;
  bottom: 0px;
  left: 0px;
  right: 0px;
  background: linear-gradient(rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 1) 80%);
  color: white;
  font-size: 18px;
  padding: 5px 10px;
  margin: 0;
  border-radius: 4px;
  line-height: 1.2;
  text-align: left;
}

.new-image {
  max-width: 400px;
  max-height: 229px; 
  display: block;
  margin: 0 auto;
  width: 400px;
  height: 288px;
  object-fit: cover;
}

.news-container {
  max-width: 1366px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.news-title {
  text-align: left;
  font-size: 28px;
  display: flex;
  font-size: 28px;
  align-items: center;
  gap: 10px;
}

.news-title hr {
  flex-grow: 1;
  border: 0;
  border-top: 1px solid ; 
  margin: 0;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.new-card {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border: 1px solid #ddd;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
}

.new-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.new-content {
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.bottom-content {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  margin-top: auto;
}

.new-description {
  color: #444;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-align: left;
  margin-bottom: 10px;
}

.new-date {
  font-size: 14px;
  text-align: left;
  margin-bottom: 5px;
  color: #888;
}

.new-ref {
  height: 40px;
  font-size: 14px;
  text-align: left;
  margin-right: 15px;
  margin-bottom: 5px;
  align-content: center;
}

.new-ref {
  color: #eb4748;
  font-weight: bold;
}

.load-more-button {
  margin: 20px auto;
  display: block;
  padding: 12px 65px;
  background-color: #ff3b30;
  color: #fff;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.load-more-button:hover {
  background-color: #e2362b;
}

.images-circles {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 10px;
}

.circle-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  transition: transform 0.3s ease;
}

.circle-image:hover {
  transform: scale(1.1);
}
</style>