const resolvers = {
    Query: {
        // returns an array of Tracks that will be used to populate the homepage grid of our web client
        tracksForHome: (_, __, { dataSources }) => {
            return dataSources.trackAPI.getTracksForHome();
        },

        // get a single track by ID, for the track page
        track: (_, { id }, { dataSources }) => {
            return dataSources.trackAPI.getTrack(id);
        },

        // get a single module by ID, for the module detail page
        module: (_, { id }, { dataSources }) => {
            return dataSources.trackAPI.getModule(id);
        },
    },
    Mutation: {
        incrementTrackViews: async (_, { id }, { dataSources }) => {
            try {
                const track = await dataSources.trackAPI.incrementTrackViews(
                    id
                );

                return {
                    code: 200,
                    success: true,
                    message: `Successfully incremented number of views for track ${id}`,
                    track,
                };
            } catch (err) {
              return {
                  // When an error occurs, Apollo Server attaches an extensions field to that error that contains relevant error details. In this case, as our TrackAPI extends RESTDataSource, this extensions object will be enriched with a response property, which provides some additional information about the HTTP response itself. We can return the status property, which refers to the HTTP status code. Perfect to use here!
                  code: err.extensions.response.status,
                  success: false,
                  // For the message property, we can craft a custom one, but let's use another value from the same extensions.response object. That's the extensions.response.body property. It makes this value more dynamic, since it might return other types of errors in the future.
                  message: err.extension.response.body,
                  track: null,
              };
            }
        },
    },
    Track: {
        author: ({ authorId }, _, { dataSources }) => {
            return dataSources.trackAPI.getAuthor(authorId);
        },

        modules: ({ id }, _, { dataSources }) => {
            return dataSources.trackAPI.getTrackModules(id);
        },
    },
};

module.exports = resolvers;
