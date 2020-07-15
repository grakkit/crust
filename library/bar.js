const BarColor = Java.type('org.bukkit.boss.BarColor');
const BarStyle = Java.type('org.bukkit.boss.BarStyle');
const NamespacedKey = Java.type('org.bukkit.NamespacedKey');

export const wrapper = (_, $) => {
   return (instance) => {
      const thing = {
         get color () {
            return $('+').backs('barColor')[instance.getColor()];
         },
         set color (value) {
            typeof value === 'string' && (value = $('+').fronts('barColor')[value]);
            if (value instanceof BarColor) instance.setColor(value);
            else throw 'TypeError: That color is invalid!';
         },
         get flags () {
            return _.define($('+').fronts('barFlag'), (entry) => {
               return {
                  get: () => {
                     return instance.hasFlag(entry.value);
                  },
                  set: (value) => {
                     if (typeof value === 'boolean') {
                        if (value) instance.addFlag(entry.value);
                        else instance.removeFlag(entry.value);
                     } else {
                        throw 'TypeError: You must supply a boolean value!';
                     }
                  }
               };
            });
         },
         set flags (value) {
            _.keys($('+').fronts('barFlag')).forEach((key) => (thing.flags[key] = value[key] || false));
         },
         get instance () {
            return instance;
         },
         get key () {
            return instance.getKey();
         },
         get players () {
            return [ ...instance.getPlayers() ];
         },
         set players (value) {
            if (_.iterable(value)) {
               const input = value.map((player) => {
                  try {
                     return _.player(player);
                  } catch (error) {
                     throw 'TypeError: That array contains invalid player entries!';
                  }
               });
               thing.players.forEach((player) => instance.removePlayer(player));
               input.forEach((player) => instance.addPlayer(player.offline));
            } else {
               throw 'TypeError: You must supply an array of player identifiers!';
            }
         },
         get progress () {
            return instance.getProgress();
         },
         set progress (value) {
            if (typeof value === 'number') instance.setProgress(value);
            else throw 'TypeError: You must supply a numeric value!';
         },
         get style () {
            return $('+').backs('barStyle')[instance.getStyle()];
         },
         set style (value) {
            typeof value === 'string' && (value = $('+').fronts('barStyle')[value]);
            if (value instanceof BarStyle) instance.setStyle(value);
            else throw 'TypeError: That style is invalid!';
         },
         get title () {
            return instance.getTitle();
         },
         set title (value) {
            if (typeof value === 'string') instance.setTitle(value);
            else throw 'TypeError: You must supply a string value!';
         }
      };
      return thing;
   };
};

export const parser = (_, $) => {
   return (thing) => {
      const key = new NamespacedKey(...thing.key.split(':'));
      let bar = server.getBossBar(key);
      const color = $('+').fronts('barColor')[thing.color];
      const style = $('+').fronts('barStyle')[thing.style];
      const flags = _.flat(_.entries(thing.flags).map((entry) => entry.value && $('+').fronts('barFlag')[entry.key]));
      if (!bar) {
         bar = server.createBossBar(key, thing.title, color, style, flags);
      } else {
         bar.setTitle(thing.title);
         bar.setColor($('+').fronts('barColor')[thing.color]);
         flags.map((flag) => bar.addFlag(flag));
      }
      bar.setProgress(thing.progress);
      return bar;
   };
};

export const chain = (_, $) => {
   return {
      color: 'setter',
      flags: 'setterNest',
      instance: 'getter',
      key: 'getter',
      players: 'setter',
      progress: 'setter',
      serialize: (thing) => {
         if (_.def(thing)) {
            return {
               format: 'bar',
               key: `${thing.key.getNamespace()}:${thing.key.getKey()}`,
               title: thing.title,
               progress: thing.progress,
               color: thing.color,
               style: thing.style,
               flags: Object.assign({}, thing.flags)
            };
         } else {
            return null;
         }
      },
      style: 'setter',
      title: 'setter'
   };
};
