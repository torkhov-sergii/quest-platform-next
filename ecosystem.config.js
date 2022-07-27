module.exports = {
    apps: [
        {
            name: 'mediaplatform',
            exec_mode: 'cluster',
            instances: 1, // Or a number of instances
            script: 'npm',
            args: 'start',
            env: {
                PORT: process.env.PORT ?? '3020',
            }
        }
    ]
}
