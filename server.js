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

const TOKEN = process.env.TOKEN;
const ROLE_VERIFY_ID = '1529156325735534694'; 
const CHANNEL_VERIFY_ID = '1529833944198156369'; 
const CHANNEL_LOG_ID = '1529841593559945226'; // ล็อกยืนยันตัวตนเดิม

// ==================== [ไอดีห้องสำหรับระบบบันทึก Log ทั้ง 8 ห้อง] ====================
const LOG_MESSAGE_ID = '1530579415170416841';       // 📋 𝕧 บันทึกข้อความ (ใช้ห้องสำรองชั่วคราว หรือเปลี่ยนไอดีตามต้องการ)
const LOG_VOICE_ID = '1530579415170416841';         // 📋 𝕧 บันทึกห้องเสียง
const LOG_CHANNEL_UPDATE_ID = '1530579415170416841'; // 📋 𝕧 บันทึกช่องแชท
const LOG_MEDIA_ID = '1530579415170416841';         // 📋 𝕧 บันทึกไฟล์สื่อ
const LOG_BAN_ID = '1530579415170416841';           // 📋 𝕧 บันทึกละเมิด
const LOG_SERVER_ID = '1530579415170416841';        // 📋 𝕧 บันทึกเซิร์ฟเวอร์
// หมายเหตุ: พี่สามารถเอา ID ห้องจริงๆ จากดิสคอร์ดมาเปลี่ยนแทนตัวเลขด้านบนได้เลยครับ 
// ตอนนี้ผมใส่ไอดีห้องต้อนรับคั่นไว้ก่อนเพื่อไม่ให้โค้ด Error ตอนรัน
// =================================================================================

const CHANNEL_TICKET_PANEL_ID = '1530263182726271047'; 
const CATEGORY_TICKET_ID = '1529474261801242777'; 
const ROLE_ADMIN_TICKET_ID = '1530263560754565140'; 

const CHANNEL_WELCOME_ID = '1530579415170416841';
const CHANNEL_GOODBYE_ID = '1530579438289551440';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers, // สำคัญมากต้องเปิด Intent ในเว็บ Discord Dev ด้วย
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates, // เพิ่มเพื่อให้ระบบ Log เสียงทำงาน
        GatewayIntentBits.GuildModeration    // เพิ่มเพื่อให้ระบบ Log แบน/ละเมิดทำงาน
    ]
});

const verificationCodes = new Map();

client.once('ready', () => {
    console.log(`Bot logged in as ${client.user.tag} (Full Logs & Systems Active)`);
    client.user.setPresence({
        activities: [{ name: 'ระบบต้อนรับ & ยืนยันตัวตน & ตั๋ว & บันทึก Log', type: 0 }],
        status: 'online',
    });
});

// ==================== ระบบต้อนรับ (Welcome - รูปแบบตามที่ขอ) ====================
client.on('guildMemberAdd', async member => {
    try {
        const welcomeChannel = await member.guild.channels.fetch(CHANNEL_WELCOME_ID).catch(() => null);
        if (!welcomeChannel) return;

        const file = new AttachmentBuilder('https://i.postimg.cc/nVDvyMVH/54bda352b17744efa1f6898040455423.gif');

        const welcomeEmbed = new EmbedBuilder()
            .setTitle('𝟷𝟷𝑇𝐻 𝐼𝑁𝐹𝐴𝑁𝑇𝑅𝑌 𝑅𝐸𝐺𝐼𝑀𝐸𝑁𝑇, 𝐾𝐼𝑁𝐺\'𝑆 𝑂𝑊𝑁 𝐵𝑂𝐷𝑌𝐺𝑈𝐴𝑅𝐷 | กรมทหารราบที่ ๑๑ มหาดเล็กราชวัลลภรักษาพระองค์')
            .setDescription(
                '╔═════════════╗\n\n' +
                'ยินดีต้อนรับสู่ ``กรมทหารราบที่ ๑๑ มหาดเล็กราชวัลลภรักษาพระองค์`` <:emoji_1:1529164325779144755> <:emoji_6:1530575127547482274> \n\n' +
                `𝐍𝐚𝐦𝐞 : <@${member.id}>\n\n\n` +
                'ยืนยันตัวตนที่ช่อง [ยืนยันตัวตน](https://discord.com/channels/1529134792665206948/1529833944198156369) <:emoji_1:1529164325779144755>\n\n' +
                '```👑 "ผู้เป็นที่รัก สนิท คุ้นเคยของพระราชา" 👑```\n\n' +
                '𝐖𝐄𝐋𝐂𝐎𝐌𝐄 𝐓𝐎 𝐒𝐄𝐑𝐕𝐄𝐑 "𝟏𝟏𝐓𝐇 𝐈𝐍𝐅𝐴𝑁𝐓𝑅𝑌 𝑅𝐸𝐺𝐼𝑀𝐸𝑁𝑇, 𝐊𝐈𝐍𝐆\'𝐒 𝑂𝑊𝑁 𝐵𝑂𝐷𝑌𝐺𝑈𝐴𝑅𝐷 | กรมทหารราบที่ ๑๑ มหาดเล็กราชวัลลภรักษาพระองค์ <:emoji_6:1530575127547482274> \n' +
                '╚═════════════╝'
            )
            .setImage('attachment://54bda352b17744efa1f6898040455423.gif')
            .setColor(0x00FF00);

        await welcomeChannel.send({ embeds: [welcomeEmbed], files: [file] });
    } catch (err) {
        console.error('Welcome Error:', err);
    }
});

// ==================== ระบบอำลา (Goodbye - รูปแบบตามที่ขอ) ====================
client.on('guildMemberRemove', async member => {
    try {
        const goodbyeChannel = await member.guild.channels.fetch(CHANNEL_GOODBYE_ID).catch(() => null);
        if (!goodbyeChannel) return;

        const file = new AttachmentBuilder('https://i.postimg.cc/qRp99WyL/7c2c7f8d6bce126774a63e43d39fec55.gif');
        const goodbyeEmbed = new EmbedBuilder()
            .setTitle('𝟷𝟷𝑇𝐻 𝐼𝑁𝐹𝐴𝑁𝑇𝑅𝑌 𝑅𝐸𝐺𝐼𝑀𝐸𝑁𝑇, 𝐾𝐼𝑁𝐺\'𝑆 𝑂𝑊𝑁 𝐵𝑂𝐷𝑌𝐺𝑈𝐴𝑅𝐷 | กรมทหารราบที่ ๑๑ มหาดเล็กราชวัลลภรักษาพระองค์')
            .setDescription(
                '╔═════════════╗\n\n' +
                `**ลาก่อนคุณ <@${member.id}> \nไว้พบใหม่ในวันข้างหน้าที่แสนดี 🫡 <:emoji_1:1529164325779144755> <:emoji_6:1530575127547482274> **\n\n` +
                '𝐆𝐎𝐎𝐃𝐁𝐘𝐄 𝐓𝐎 𝐒𝐄𝐑𝐕𝐄𝐑 "𝟏𝟏𝐓𝐇 𝐈𝐍𝐅𝐴𝑁𝑇𝑅𝑌 𝑅𝐸𝐺𝐼𝑀𝐸𝑁𝑇, 𝐊I𝐍𝐺\'𝑆 𝑂𝑊𝑁 𝐵𝑂𝐷𝑌𝐺𝑈𝐴𝑅𝐷 | กรมทหารราบที่ ๑๑ มหาดเล็กราชวัลลภรักษาพระองค์ <:emoji_6:1530575127547482274> \n' +
                '╚═════════════╝'
            )
            .setImage('attachment://7c2c7f8d6bce126774a63e43d39fec55.gif')
            .setColor(0xFF0000);

        await goodbyeChannel.send({ embeds: [goodbyeEmbed], files: [file] });
    } catch (err) {
        console.error('Goodbye Error:', err);
    }
});

// ==================== ระบบบันทึก Log (ข้อความ, เสียง, สื่อ, ละเมิด) ====================
client.on('messageUpdate', async (oldMessage, newMessage) => {
    if (oldMessage.author?.bot || !oldMessage.content || !newMessage.content) return;
    if (oldMessage.content === newMessage.content) return;

    const logChan = await oldMessage.guild.channels.fetch(LOG_MESSAGE_ID).catch(() => null);
    if (!logChan) return;

    const embed = new EmbedBuilder()
        .setTitle('✏️ บันทึกการแก้ไขข้อความ')
        .addFields(
            { name: 'ผู้ส่ง', value: `<@${oldMessage.author.id}>`, inline: false },
            { name: 'ช่องแชท', value: `<#${oldMessage.channel.id}>`, inline: false },
            { name: 'ข้อความเดิม', value: oldMessage.content, inline: false },
            { name: 'ข้อความหลังแก้ไข', value: newMessage.content, inline: false }
        )
        .setColor(0xFFA500)
        .setTimestamp();
    await logChan.send({ embeds: [embed] }).catch(() => {});
});

client.on('messageDelete', async message => {
    if (message.author?.bot) return;
    if (message.attachments.size > 0) {
        const logMediaChan = await message.guild.channels.fetch(LOG_MEDIA_ID).catch(() => null);
        if (logMediaChan) {
            const embed = new EmbedBuilder()
                .setTitle('🖼️ บันทึกไฟล์สื่อถูกลบ')
                .addFields(
                    { name: 'ผู้ส่ง', value: message.author ? `<@${message.author.id}>` : 'ไม่ทราบผู้ส่ง', inline: false },
                    { name: 'ช่องแชท', value: `<#${message.channel.id}>`, inline: false }
                )
                .setColor(0xFF0000)
                .setTimestamp();
            await logMediaChan.send({ embeds: [embed] }).catch(() => {});
        }
    }
});

client.on('voiceStateUpdate', async (oldState, newState) => {
    const logVoiceChan = await oldState.guild.channels.fetch(LOG_VOICE_ID).catch(() => null);
    if (!logVoiceChan) return;

    const member = newState.member;
    if (!member) return;

    if (!oldState.channelId && newState.channelId) {
        const embed = new EmbedBuilder().setTitle('🔊 เข้าห้องเสียง').setDescription(`<@${member.id}> ได้เข้ามายังห้องเสียง <#${newState.channelId}>`).setColor(0x00FF00).setTimestamp();
        await logVoiceChan.send({ embeds: [embed] }).catch(() => {});
    } else if (oldState.channelId && !newState.channelId) {
        const embed = new EmbedBuilder().setTitle('🔇 ออกจากห้องเสียง').setDescription(`<@${member.id}> ได้ออกจากห้องเสียง <#${oldState.channelId}>`).setColor(0xFF0000).setTimestamp();
        await logVoiceChan.send({ embeds: [embed] }).catch(() => {});
    } else if (oldState.channelId && newState.channelId && oldState.channelId !== newState.channelId) {
        const embed = new EmbedBuilder().setTitle('🔄 ย้ายห้องเสียง').setDescription(`<@${member.id}> ย้ายจากห้อง <#${oldState.channelId}> ไปยัง <#${newState.channelId}>`).setColor(0x00FFFF).setTimestamp();
        await logVoiceChan.send({ embeds: [embed] }).catch(() => {});
    }
});

client.on('guildBanAdd', async ban => {
    const logBanChan = await ban.guild.channels.fetch(LOG_BAN_ID).catch(() => null);
    if (!logBanChan) return;

    const embed = new EmbedBuilder()
        .setTitle('🦇 บันทึกการลงโทษ (แบนสมาชิก)')
        .setDescription(`ผู้ใช้ ${ban.user.tag} (ID: ${ban.user.id}) ถูกแบนออกจากเซิร์ฟเวอร์`)
        .setColor(0xFF0000)
        .setTimestamp();
    await logBanChan.send({ embeds: [embed] }).catch(() => {});
});

// ==================== ระบบคำสั่ง Setup ====================
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
                .setTitle('<:emoji_1:1529164325779144755> <a:emoji_7:1530591663758643200> ติดต่อราชสำนัก')
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

// ==================== ระบบปุ่มกด, โมเดล และเมนูตั๋ว ====================
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

// ระบบเว็บเซิร์ฟเวอร์จำลองสำหรับ Render รัน 24/7
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Bot is running 24/7!'));
app.listen(PORT, () => console.log(`Web server is running on port ${PORT}`));
