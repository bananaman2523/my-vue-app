<template>
  <News /> 
  <div class="activities-container">
    <h1 class="activities-title">Activities<hr></h1>
    <div class="activities-grid">
      <div v-for="(activity, index) in visibleNews" :key="index" class="activity-card"
        @click="navigateToDetails(activity)">
        <div class="image-container">
          <img v-if="activity.imgs && activity.imgs.length > 0" :src="getAssetURL(activity.imgs[0].directus_files_id)"
            class="activity-image" />
        </div>
        <div class="activity-content">
          <p class="activity-description">{{ activity.translations[0].title }}</p>
          <div class="bottom-content">
            <p class="activity-date">{{ activity.date }}</p>
          </div>

        </div>
      </div>
    </div>
    <button class="load-more-button" @click="toggleVisibility">
      <span>{{ showAll ? 'Less' : 'More' }}</span>
      <i :class="showAll ? 'arrow-up' : 'arrow-down'"></i>
    </button>
  </div>
</template>

<script>
import { directus } from "@/services/directus";
import { getAssetURL } from "@/services/get-asset-url";
import News from "@/components/News.vue";

import { format } from "date-fns";
import { readItems } from "@directus/sdk";

export default {
  name: "ActivitiesGrid",
  data() {
    return {
      activities: [],
      visibleCount: 6,
      showAll: false,
    };
  },
  computed: {
    visibleNews() {
      return this.showAll ? this.activities : this.activities.slice(0, this.visibleCount);
    },
  },
  components: {
    News
  },
  methods: {
    async fetchData() {
      try {

        const response = await directus.request(
          readItems('activities_page', {
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
            fields: ['id', 'title', 'description', 'date', 'status', 'imgs.*', 'translations.*'],
            filter: {
              status: {
                _eq: 'publish'
              }
            }
          }));
        console.log(response)

        if (response) {
          this.activities = response.map((activity) => ({
            ...activity,
            date: this.formatDate(activity.date),
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
    navigateToDetails(activity) {
      this.$router.push({
        name: "ActivityDetails",
        params: { id: activity.id },
        state: { activityData: activity },
      });
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

.activity-image {
  width: 100%;
  height: auto;
  max-width: 400px;
  max-height: 229px; 
  object-fit: cover; 
  display: block;
  margin: 0 auto;
}

.activities-container {
  max-width: 1366px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.activities-title {
  display: flex;
  font-size: 28px;
  align-items: center; 
  gap: 10px; 
}

.activities-title hr {
  flex-grow: 1;
  border: 0;
  border-top: 1px solid ; 
  margin: 0;
}

.activities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.activity-card {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border: 1px solid #ddd;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
}

.activity-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.activity-content {
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

.activity-description {
  color: #444;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-align: left;
  margin-bottom: 10px;
}

.activity-date {
  font-size: 14px;
  text-align: left;
  margin-bottom: 5px;
}

.activity-date {
  color: #888;
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