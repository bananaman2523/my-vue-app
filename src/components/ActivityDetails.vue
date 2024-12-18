<template>
    <div v-if="activity" class="activity-details-container">
        <h1 class="details-title">{{ activity.title }}</h1>
        <img v-if="activity.imgs && activity.imgs.length > 0" :src="getAssetURL(activity.imgs[0].directus_files_id)"
            class="details-image" />
        <p class="details-description">{{ activity.description }}</p>
        <p class="details-date">{{ activity.date }}</p>
    </div>
    <div v-else class="loading">
        Loading...
    </div>
</template>


<script>
import { getAssetURL } from "@/services/get-asset-url";
import { directus } from "@/services/directus";
import { readItems } from "@directus/sdk";

export default {
    name: "ActivityDetails",
    props: ["id"],
    data() {
        return {
            activity: {
                title: "",
                description: "",
                date: "",
                imgs: [],
            },
        };
    },

    methods: {
        async fetchActivity() {
            try {
                const response = await directus.request(
                    readItems('activities_page', {
                        deep: {
                            translations: {
                                _filter: {
                                    _and: [
                                        {
                                            languages_code: { _eq: 'th-TH' },
                                        },
                                    ],
                                },
                            },
                        },
                        fields: ['id', 'title', 'description', 'date', 'status', 'imgs.*', 'translations.*']
                    }));

                const data = await response
                this.activity = data;
            } catch (error) {
                console.error("Error fetching activity details:", error);
            }
        },
        getAssetURL,
    },
    created() {
        if (this.$router.options.history.state.activityData) {
            this.activity = this.$router.options.history.state.activityData;
        } else {
            this.fetchActivity();
        }
    },
};
</script>

<style scoped>
.activity-details-container {
    padding: 20px;
    text-align: center;
}

.details-title {
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 10px;
}

.details-image {
    width: 100%;
    max-width: 600px;
    height: auto;
    margin: 20px 0;
    object-fit: cover;
}

.details-description {
    font-size: 18px;
    margin-bottom: 10px;
}

.details-date {
    font-size: 16px;
    color: #888;
}
</style>