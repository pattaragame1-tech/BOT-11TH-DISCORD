const { 
    Client, 
    GatewayIntentBits, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    ModalBuilder, 
    TextInputBuilder, 
    TextInputStyle, 
    EmbedBuilder, 
    StringSelectMenuBuilder, 
    ChannelType, 
    PermissionsBitField,
    AttachmentBuilder 
} = require('discord.js');

const TOKEN = 'MTUyOTgxNDY4OTg0NzE4NTUzOA.GKA29n.SJLbeI46dw7wPvl6GH0tS13KTSNaPPBvRY1JIg';
const ROLE_VERIFY_ID = '1529156325735534694'; 
const CHANNEL_VERIFY_ID = '1529833944198156369'; 
const CHANNEL_LOG_ID = '1529841593559945226'; 

const CHANNEL_TICKET_PANEL_ID = '1530263182726271047'; 
const CATEGORY_TICKET_ID = '1529474261801242777'; 
const ROLE_ADMIN_TICKET_ID = '1530263560754565140'; 

const CHANNEL_WELCOME_ID = '1530579415170416841';
const CHANNEL_GOODBYE_ID = '1530579438289551440';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const verificationCodes = new Map();

client.once('ready', () => {
    console.log(`Bot logged in as ${client.user.tag} (Full Systems Active)`);
    client.user.setPresence({
        activities: [{ name: 'ระบบต้อนรับ & ยืนยันตัวตน & ตั๋ว', type: 0 }],
        status: 'online',
    });
});

client.on('guildMemberAdd', async member => {
    try {
        const welcomeChannel = await member.guild.channels.fetch(CHANNEL_WELCOME_ID).catch(() => null);
        if (!welcomeChannel) return;

        const memberCount = member.guild.memberCount;
        const paddedCount = String(memberCount).padStart(3, '0');
        const file = new AttachmentBuilder('https://i.postimg.cc/nVDvyMVH/54bda352b17744efa1f6898040455423.gif');

        const welcomeEmbed = new EmbedBuilder()
            .setTitle('𝟷𝟷𝑇𝐻 𝐼𝑁𝐹𝐴𝑁𝑇𝑅𝑌 𝑅𝐸𝐺𝐼𝑀𝐸𝑁𝑇, 𝐾𝐼𝑁𝐺\'𝑆 𝑂𝑊𝑁 𝐵𝑂𝐷𝑌𝐺𝑈𝐴𝑅𝐷 | กรมทหารราบที่ ๑๑ มหาดเล็กราชวัลลภรักษาพระองค์')
            .setDescription(
                '╔═════════════╗\n\n' +
                'ยินดีต้อนรับสู่ ``กรมทหารราบที่ ๑๑ มหาดเล็กราชวัลลภรักษาพระองค์``\n\n' +
                `Name <@${member.id}>\n\n` +
                `คุณเป็นคนที่ ${paddedCount}\n\n` +
                'ยืนยันตัวตนที่ช่อง [ยืนยันตัวตน](https://discord.com/channels/1529134792665206948/1529833944198156369) <:emoji_1:1529164325779144755>\n\n' +
                '```👑 "ผู้เป็นที่รัก สนิท คุ้นเคยของพระราชา" 👑```\n\n' +
                '╚═════════════╝'
            )
            .setImage('attachment://54bda352b17744efa1f6898040455423.gif')
            .setColor(0x00FF00);

        await welcomeChannel.send({ embeds: [welcomeEmbed], files: [file] });
    } catch (err) {
        console.error('Welcome Error:', err);
    }
});

client.on('guildMemberRemove', async member => {
    try {
        const goodbyeChannel = await member.guild.channels.fetch(CHANNEL_GOODBYE_ID).catch(() => null);
        if (!goodbyeChannel) return;

        const file = new AttachmentBuilder('https://i.postimg.cc/qRp99WyL/7c2c7f8d6bce126774a63e43d39fec55.gif');
        const goodbyeEmbed = new EmbedBuilder()
            .setTitle('𝟷𝟷𝑇𝐻 𝐼𝑁𝐹𝐴𝑁𝑇𝑅𝑌 𝑅𝐸𝐺𝐼𝑀𝐸𝑁𝑇, 𝐾𝐼𝑁𝐺\'𝑆 𝑂𝑊𝑁 𝐵𝑂𝐷𝑌𝐺𝑈𝐴𝑅𝐷')
            .setDescription(`**ลาก่อนคุณ <@${member.id}> \nไว้พบใหม่ในวันข้างหน้าที่แสนดี🫡 **`)
            .setImage('attachment://7c2c7f8d6bce126774a63e43d39fec55.gif')
            .setColor(0xFF0000);

        await goodbyeChannel.send({ embeds: [goodbyeEmbed], files: [file] });
    } catch (err) {
        console.error('Goodbye Error:', err);
    }
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    if (message.content === '!setup') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply({ content: 'คุณไม่มีสิทธิ์ใช้งานคำสั่งนี้', ephemeral: true });
        }

        if (message.channel.id === CHANNEL_VERIFY_ID) {
            const embedVerify = new EmbedBuilder()
                .setTitle('<:emoji_1:1529164325779144755> ยืนยันตัวตน ร.๑๑ 𝐕𝐄𝐑𝐈𝐅𝐈𝐂𝐀𝐓𝐈𝐎𝐍')
                .setDescription('กรุณากดปุ่ม "ยืนยันตัวตน" ด้านล่าง เพื่อทำรายการยืนยันตัวตน')
                .setColor(0x00FF00);

            const rowVerify = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('btn_verify')
                    .setLabel('ยืนยันตัวตน')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('<a:emoji_3:1529863155432423605>')
            );

            await message.channel.send({ embeds: [embedVerify], components: [rowVerify] });
            return message.reply({ content: 'ตั้งค่าระบบยืนยันตัวตนเรียบร้อย!', ephemeral: true });
        }

        if (message.channel.id === CHANNEL_TICKET_PANEL_ID) {
            const file = new AttachmentBuilder('https://i.postimg.cc/mD7hPyMm/mi-m-ch-x-399-20260725185819.jpg');
            const embedTicket = new EmbedBuilder()
                .setTitle('<:emoji_1:1529164325779144755> ติดต่อราชสำนัก')
                .setImage('attachment://mi-m-ch-x-399-20260725185819.jpg')
                .setDescription('ข้อมูลของคุณจะถูกเก็บเป็นความลับ')
                .setColor(0xFF0000);

            const rowTicket = new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('select_ticket_topic')
                    .setPlaceholder('เลือกหัวข้อที่ต้องการติดต่อ')
                    .addOptions([
                        { label: 'ติดต่อทั่วไป', description: 'ติดต่อราชการทั่วไป/สอบถามเบื้องต้น', value: 'topic_hack', emoji: '<a:emoji_4:1530536353564196966>' },
                        { label: 'แจ้งความประสงค์การลาออกราชการ ร.๑๑', description: 'สำหรับผู้ที่ไม่สะดวกรับราชการกรม ร.๑๑ มหด.รอ. ต่อ', value: 'topic_role', emoji: '<a:emoji_4:1530536353564196966>' },
                        { label: 'แจ้งรายงานพฤติกรรมกำลังพล ร.๑๑', description: 'พบเห็นกำลังพล ร.๑๑ กระทำความผิด', value: 'topic_general', emoji: '<a:emoji_4:1530536353564196966>' }
                    ])
            );

            await message.channel.send({ embeds: [embedTicket], files: [file], components: [rowTicket] });
            return message.reply({ content: 'ตั้งค่าระบบตั๋วเรียบร้อย!', ephemeral: true });
        }
    }
});

client.on('interactionCreate', async interaction => {
    try {
        if (interaction.isButton() && interaction.customId === 'btn_verify') {
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            verificationCodes.set(interaction.user.id, code);
            setTimeout(() => verificationCodes.delete(interaction.user.id), 5 * 60 * 1000);

            const modal = new ModalBuilder()
                .setCustomId('modal_verify')
                .setTitle('ระบบยืนยันตัวตน');

            const codeInput = new TextInputBuilder()
                .setCustomId('input_verify_code')
                .setLabel(`รหัสของคุณ: ${code}`)
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('กรุณาพิมพ์รหัสด้านบนมาตรงนี้')
                .setRequired(true);

            modal.addComponents(new ActionRowBuilder().addComponents(codeInput));
            return await interaction.showModal(modal);
        }

        if (interaction.isModalSubmit() && interaction.customId === 'modal_verify') {
            await interaction.deferReply({ ephemeral: true });
            const userEntered = interaction.fields.getTextInputValue('input_verify_code').trim();
            const correctCode = verificationCodes.get(interaction.user.id);

            if (!correctCode) {
                return interaction.editReply({ content: '❌ รหัสยืนยันของคุณหมดอายุแล้ว กรุณากดปุ่มยืนยันตัวตนใหม่อีกครั้ง' });
            }

            if (userEntered === correctCode) {
                const member = await interaction.guild.members.fetch(interaction.user.id);
                if (member.roles.cache.has(ROLE_VERIFY_ID)) {
                    verificationCodes.delete(interaction.user.id);
                    return interaction.editReply({ content: '⚠️ คุณได้ยืนยันตัวตนไปแล้วเรียบร้อยครับ' });
                }

                await member.roles.add(ROLE_VERIFY_ID);
                await interaction.editReply({ content: '<a:emoji_2:1529862630225870899> `ยืนยันตัวตนสำเร็จ!!!` คุณได้รับยศเรียบร้อยแล้ว ยินดีต้อนรับสู่ `กรมทหารราบที่ ๑๑ มหาดเล็กราชวัลลภรักษาพระองค์` 🎉' });

                const logChannel = await interaction.guild.channels.fetch(CHANNEL_LOG_ID).catch(() => null);
                if (logChannel) {
                    const logEmbed = new EmbedBuilder()
                        .setTitle('อัพเดท')
                        .addFields(
                            { name: 'สมาชิก', value: `<@${interaction.user.id}>`, inline: false },
                            { name: 'Role ที่เพิ่ม', value: `<@&${ROLE_VERIFY_ID}>`, inline: false }
                        )
                        .setColor(0x00FF00)
                        .setTimestamp();
                    await logChannel.send({ embeds: [logEmbed] }).catch(() => {});
                }
                verificationCodes.delete(interaction.user.id);
            } else {
                await interaction.editReply({ content: '❌ รหัสยืนยันไม่ถูกต้อง กรุณาลองกดปุ่มยืนยันตัวตนใหม่อีกครั้ง' });
            }
        }

        if (interaction.isStringSelectMenu() && interaction.customId === 'select_ticket_topic') {
            await interaction.deferReply({ ephemeral: true });

            const selectedValue = interaction.values[0];
            let topicName = 'ติดต่อแอดมินทั่วไป';
            if (selectedValue === 'topic_hack') topicName = 'ติดต่อแอดมินทั่วไป';
            if (selectedValue === 'topic_role') topicName = 'แจ้งความประสงค์การลาออกราชการ ร.๑๑';
            if (selectedValue === 'topic_general') topicName = 'แจ้งรายงานพฤติกรรมกำลังพล ร.๑๑';

            const guild = interaction.guild;
            const ticketChannelName = `ticket-${Math.floor(1000 + Math.random() * 9000)}`;

            const ticketChannel = await guild.channels.create({
                name: ticketChannelName,
                type: ChannelType.GuildText,
                parent: CATEGORY_TICKET_ID,
                permissionOverwrites: [
                    { id: guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
                    { 
                        id: interaction.user.id, 
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] 
                    },
                    { 
                        id: ROLE_ADMIN_TICKET_ID, 
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] 
                    },
                ],
            });

            const ticketEmbed = new EmbedBuilder()
                .setTitle(`<a:emoji_5:1530562940821049406> ${topicName}`)
                .setDescription(
                    `สวัสดี! นี่คือตั๋วสำหรับ${topicName}\n` +
                    `กรุณากรอกข้อมูลให้ครบเพื่อให้แอดมินช่วยได้รวดเร็ว\n` +
                    `\`\`\`text\n(1) ชื่อใน Roblox : ชื่อของคุณ\n(2) หัวข้อที่ต้องการติดต่อ : สรุปสั้นๆ\n(3) รายละเอียด : อธิบายปัญหาหรือคำถาม\n(4) หลักฐาน : แนบรูปภาพ (ถ้ามี)\`\`\`\n` +
                    `📌 หากแอดมินไม่ตอบ กรุณารอภายใน 24 ชั่วโมง`
                )
                .setColor(0x00FF00);

            const pingContent = `<@${interaction.user.id}> <@&${ROLE_ADMIN_TICKET_ID}>`;
            const closeRow = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('btn_close_ticket')
                    .setLabel('🔒 ปิดตั๋ว')
                    .setStyle(ButtonStyle.Danger)
            );

            await ticketChannel.send({ content: pingContent, embeds: [ticketEmbed], components: [closeRow] });
            await interaction.editReply({ content: `✅ เปิดห้องตั๋วให้คุณแล้วครับ: <#${ticketChannel.id}>` });
        }

        if (interaction.isButton() && interaction.customId === 'btn_close_ticket') {
            const isAdmin = interaction.member.roles.cache.has(ROLE_ADMIN_TICKET_ID);

            if (!isAdmin) {
                return interaction.reply({ content: '❌ เฉพาะผู้ดูแลระบบเท่านั้นที่มีสิทธิ์กดปิดตั๋วนี้ครับ!', ephemeral: true });
            }

            await interaction.reply({ content: '🔒 กำลังปิดห้องตั๋วใน 5 วินาที...' });
            setTimeout(async () => {
                try {
                    await interaction.channel.delete();
                } catch (err) {
                    console.error('ไม่สามารถลบห้องได้:', err);
                }
            }, 5000);
        }
    } catch (error) {
        console.error('Interaction Error:', error);
        if (interaction.isRepliable() && !interaction.replied && !interaction.deferred) {
            await interaction.reply({ content: '❌ เกิดข้อผิดพลาดในการประมวลผล กรุณาลองใหม่อีกครั้ง', ephemeral: true }).catch(() => {});
        } else if (interaction.deferred) {
            await interaction.editReply({ content: '❌ เกิดข้อผิดพลาดในการประมวลผล กรุณาลองใหม่อีกครั้ง' }).catch(() => {});
        }
    }
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', error => {
    console.error('Uncaught exception:', error);
});

client.login(TOKEN);

// ระบบเว็บเซิร์ฟเวอร์จำลองสำหรับ Render
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Bot is running 24/7!'));
app.listen(PORT, () => console.log(`Web server is running on port ${PORT}`));
