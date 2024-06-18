module.exports = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'https://nextjsapiblogfolio.vercel.app/:path*', // Cambia esto por la URL de tu API
            },
        ];
    },
};
