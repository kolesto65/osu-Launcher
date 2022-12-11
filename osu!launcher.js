var fs = require('fs');
const {
    spawn
} = require('node:child_process');
let server
let settings = {
    exe: 'C:/Users/user/AppData/Local/osu!/osu!.exe',
    dir: 'C:/Users/user/AppData/Local/osu!/'
}
let servers = [{
        id: 1,
        name: 'Bancho',
        address: 'ppy.sh'
    },
    {
        id: 2,
        name: 'Gatari',
        address: 'gatari.pw'
    }
]

if (!fs.existsSync('./accounts')) {
    fs.mkdirSync('./accounts');
}

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
readline.question('Select server\n' + String(servers.map(server => `${server.id}. ${server.name}\n`)).replace(',', ''), server => {
    server = servers.find(x => x.id == Number(server))
    server.login = fs.existsSync(`./accounts/${server.name}`) ? true : false
    if (server.login) fs.copyFileSync('./accounts/' + server.name, settings.dir + '/osu!.user.cfg', )
    console.log(`Launching ${server.name}. ${!server.login ? `No saved user data for server ${server.name}` : `Logged in ${server.name}`}`)
    let osu = spawn(settings.exe, ['-devserver', server.address]);
    osu.on('close', (code) => {
        if (code == 0) console.log(`osu! closed. Saving account data for ${server.name}. Quitting...`);
        else console.log(`osu! closed with code ${code}. Quitting...`)
        fs.copyFileSync(settings.dir + '/osu!.user.cfg', './accounts/' + server.name)
        setTimeout(() => process.exit(), 3000)
    });
});
