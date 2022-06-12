const ITEMS = []

class Item
{
    constructor(item)
    {
        this.name = item.name
        this.type = item.equipment_category.name
        this.rarity = item.rarity.name
        this.description = item.desc
        
        document.getElementById(this.rarity).appendChild(this.dataSheet())
    }

    dataSheet = () =>
    {
        let datasheet = document.createElement('div')
        datasheet.className = 'item'

        let name = document.createElement('div')
        name.innerHTML = `<h1>${this.name}</h1>`

        let description = document.createElement('div')
        description.className = 'item-description'
        this.description.forEach(text => {description.innerHTML += `<p>${text}</p>`})

        datasheet.append(name, description)
        return datasheet
    }
}

const requestItem = (url) =>
{
    let request = new XMLHttpRequest()
    request.open('GET', `https://www.dnd5eapi.co${url}`, true)
    request.onload = function()
    {
        let data = JSON.parse(this.response)
        ITEMS.push(new Item(data))
    }
    request.send()
}

const requestItems = () =>
{
    let request = new XMLHttpRequest()
    request.open('GET', 'https://www.dnd5eapi.co/api/magic-items', true)
    request.onload = function()
    {
        let data = JSON.parse(this.response).results
        data.forEach(item => {requestItem(item.url)});
    }
    request.send()
}

requestItems()

const changeListVisibility = (list) =>
{
    document.getElementById('Common').style.visibility = (list == 'Common') ? 'visible' : 'hidden'
    document.getElementById('Uncommon').style.visibility = (list == 'Uncommon') ? 'visible' : 'hidden'
    document.getElementById('Rare').style.visibility = (list == 'Rare') ? 'visible' : 'hidden'
    document.getElementById('Very Rare').style.visibility = (list == 'Very Rare') ? 'visible' : 'hidden'
    document.getElementById('Legendary').style.visibility = (list == 'Legendary') ? 'visible' : 'hidden'
    document.getElementById('items').scrollTo(0, 0)
}




const filterType = (list, filters) => 
{
    return list.filter(item => {return filters.includes(item.type)})
}

const filterRarity = (list, filters) =>
{
    return list.filter(item => {return filters.includes(item.rarity)})
}

const addItem = (item, list) =>
{
    if(!item) return
    let listItem = document.createElement('div')
    listItem.className = 'item'
    listItem.innerHTML = item.name
    listItem.onmousedown = () => {listItem.innerHTML = item.dataSheet().innerHTML}
    listItem.onmouseleave = () => {listItem.innerHTML = item.name}
    list.appendChild(listItem)
}

const getShopWealth = () =>
{
    let radio = document.getElementsByName('shop-wealth');

    for(let i = 0; i < radio.length; i++)
        if(radio[i].checked) return radio[i].value
}

class Shop
{
    constructor(wealth)
    {
        switch(wealth)
        {
            case 'Moderate':
                this.numCommon = 2 + ~~(Math.random() * 3)          // 2-4
                this.numUncommon = 1 + ~~(Math.random() * 3)        // 1-3
                this.numRare = (Math.random() > .6) ? 1 : 0         // 0-1
                this.numVeryrare = 0                                // 0
                this.numLegendary = 0                               // 0
                break
            case 'Wealthy':
                this.numCommon = 5 + ~~(Math.random() * 5)          // 5-9
                this.numUncommon = 4 + ~~(Math.random() * 3)        // 4-6
                this.numRare = (Math.random() > .5) ? 2 : 1         // 1-2
                this.numVeryrare = (Math.random() > .6) ? 1 : 0     // 0-1
                this.numLegendary = 0                               // 0
                break
            case 'Very Wealthy':
                this.numCommon = 10 + ~~(Math.random() * 5)         // 10-14
                this.numUncommon = 7 + ~~(Math.random() * 4)        // 7-11
                this.numRare = 2 + ~~(Math.random() * 3)            // 2-4
                this.numVeryrare = (Math.random() > .5) ? 2 : 1     // 1-2
                this.numLegendary = (Math.random() > .8) ? 1 : 0    // 0-1
                break
            case 'Opulent':
                this.numCommon = 15 + ~~(Math.random() * 6)         // 15-20
                this.numUncommon = 12 + ~~(Math.random() * 5)       // 12-16
                this.numRare = 5 + ~~(Math.random() * 4)            // 5-8
                this.numVeryrare = (Math.random() > .5) ? 3 : 2     // 2-3
                this.numLegendary = 1                               // 1
                break
        }

        this.commonItems = []
        this.uncommonItems = []
        this.rareItems = []
        this.veryrareItems = []
        this.legendaryItems = []
    }

    generate = () =>
    {
        let commonShopItems = document.getElementById('common-shop-items')
        while(commonShopItems.lastChild) commonShopItems.removeChild(commonShopItems.lastChild)

        let uncommonShopItems = document.getElementById('uncommon-shop-items')
        while(uncommonShopItems.lastChild) uncommonShopItems.removeChild(uncommonShopItems.lastChild)

        let rareShopItems = document.getElementById('rare-shop-items')
        while(rareShopItems.lastChild) rareShopItems.removeChild(rareShopItems.lastChild)

        let veryrareShopItems = document.getElementById('veryrare-shop-items')
        while(veryrareShopItems.lastChild) veryrareShopItems.removeChild(veryrareShopItems.lastChild)

        let legendaryShopItems = document.getElementById('legendary-shop-items')
        while(legendaryShopItems.lastChild) legendaryShopItems.removeChild(legendaryShopItems.lastChild)

        for(let item of this.commonItems) addItem(item, commonShopItems)
        for(let item of this.uncommonItems) addItem(item, uncommonShopItems)
        for(let item of this.rareItems) addItem(item, rareShopItems)
        for(let item of this.veryrareItems) addItem(item, veryrareShopItems)
        for(let item of this.legendaryItems) addItem(item, legendaryShopItems)
    }
}

class GeneralShop extends Shop
{
    static commonShopItems = filterRarity(ITEMS, ['Common']).sort((a, b) => {return Math.random() > 0.5})
    static uncommonShopItems = filterRarity(ITEMS, ['Uncommon']).sort((a, b) => {return Math.random() > 0.5})
    static rareShopItems = filterRarity(ITEMS, ['Rare']).sort((a, b) => {return Math.random() > 0.5})
    static veryrareShopItems = filterRarity(ITEMS, ['Very Rare']).sort((a, b) => {return Math.random() > 0.5})
    static legendaryShopItems = filterRarity(ITEMS, ['Legendary']).sort((a, b) => {return Math.random() > 0.5})

    constructor(wealth)
    {
        super(wealth)

        GeneralShop.reset()
        for(let i = 0; i < this.numCommon; i++) this.commonItems.push(GeneralShop.commonShopItems[i % GeneralShop.commonShopItems.length])
        for(let i = 0; i < this.numUncommon; i++) this.uncommonItems.push(GeneralShop.uncommonShopItems[i % GeneralShop.uncommonShopItems.length])
        for(let i = 0; i < this.numRare; i++) this.rareItems.push(GeneralShop.rareShopItems[i % GeneralShop.rareShopItems.length])
        for(let i = 0; i < this.numVeryrare; i++) this.veryrareItems.push(GeneralShop.veryrareShopItems[i % GeneralShop.veryrareShopItems.length])
        for(let i = 0; i < this.numLegendary; i++) this.legendaryItems.push(GeneralShop.legendaryShopItems[i % GeneralShop.legendaryShopItems.length])
    }

    static reset = () =>
    {
        this.commonShopItems = filterRarity(ITEMS, ['Common']).sort((a, b) => {return Math.random() > 0.5})
        this.uncommonShopItems = filterRarity(ITEMS, ['Uncommon']).sort((a, b) => {return Math.random() > 0.5})
        this.rareShopItems = filterRarity(ITEMS, ['Rare']).sort((a, b) => {return Math.random() > 0.5})
        this.veryrareShopItems = filterRarity(ITEMS, ['Very Rare']).sort((a, b) => {return Math.random() > 0.5})
        this.legendaryShopItems = filterRarity(ITEMS, ['Legendary']).sort((a, b) => {return Math.random() > 0.5})
        console.log(GeneralShop.commonShopItems)
    }
}

class EquitementShop extends Shop
{
    static commonShopItems = filterRarity(filterType(ITEMS, ['Armor', 'Staff', 'Wand', 'Weapon']), ['Common']).sort((a, b) => {return Math.random() > 0.5})
    static uncommonShopItems = filterRarity(filterType(ITEMS, ['Armor', 'Staff', 'Wand', 'Weapon']), ['Uncommon']).sort((a, b) => {return Math.random() > 0.5})
    static rareShopItems = filterRarity(filterType(ITEMS, ['Armor', 'Staff', 'Wand', 'Weapon']), ['Rare']).sort((a, b) => {return Math.random() > 0.5})
    static veryrareShopItems = filterRarity(filterType(ITEMS, ['Armor', 'Staff', 'Wand', 'Weapon']), ['Very Rare']).sort((a, b) => {return Math.random() > 0.5})
    static legendaryShopItems = filterRarity(filterType(ITEMS, ['Armor', 'Staff', 'Wand', 'Weapon']), ['Legendary']).sort((a, b) => {return Math.random() > 0.5})

    constructor(wealth)
    {
        super(wealth)

        EquitementShop.reset()
        for(let i = 0; i < this.numCommon; i++) this.commonItems.push(EquitementShop.commonShopItems[i % EquitementShop.commonShopItems.length])
        for(let i = 0; i < this.numUncommon; i++) this.uncommonItems.push(EquitementShop.uncommonShopItems[i % EquitementShop.uncommonShopItems.length])
        for(let i = 0; i < this.numRare; i++) this.rareItems.push(EquitementShop.rareShopItems[i % EquitementShop.rareShopItems.length])
        for(let i = 0; i < this.numVeryrare; i++) this.veryrareItems.push(EquitementShop.veryrareShopItems[i % EquitementShop.veryrareShopItems.length])
        for(let i = 0; i < this.numLegendary; i++) this.legendaryItems.push(EquitementShop.legendaryShopItems[i % EquitementShop.legendaryShopItems.length])
    }

    static reset = () =>
    {
        this.commonShopItems = filterRarity(filterType(ITEMS, ['Armor', 'Staff', 'Wand', 'Weapon']), ['Common']).sort((a, b) => {return Math.random() > 0.5})
        this.uncommonShopItems = filterRarity(filterType(ITEMS, ['Armor', 'Staff', 'Wand', 'Weapon']), ['Uncommon']).sort((a, b) => {return Math.random() > 0.5})
        this.rareShopItems = filterRarity(filterType(ITEMS, ['Armor', 'Staff', 'Wand', 'Weapon']), ['Rare']).sort((a, b) => {return Math.random() > 0.5})
        this.veryrareShopItems = filterRarity(filterType(ITEMS, ['Armor', 'Staff', 'Wand', 'Weapon']), ['Very Rare']).sort((a, b) => {return Math.random() > 0.5})
        this.legendaryShopItems = filterRarity(filterType(ITEMS, ['Armor', 'Staff', 'Wand', 'Weapon']), ['Legendary']).sort((a, b) => {return Math.random() > 0.5})
    }
}

class PotionShop extends Shop
{
    static commonShopItems = filterRarity(filterType(ITEMS, ['Potion']), ['Common']).sort((a, b) => {return Math.random() > 0.5})
    static uncommonShopItems = filterRarity(filterType(ITEMS, ['Potion']), ['Uncommon']).sort((a, b) => {return Math.random() > 0.5})
    static rareShopItems = filterRarity(filterType(ITEMS, ['Potion']), ['Rare']).sort((a, b) => {return Math.random() > 0.5})
    static veryrareShopItems = filterRarity(filterType(ITEMS, ['Potion']), ['Very Rare']).sort((a, b) => {return Math.random() > 0.5})
    static legendaryShopItems = filterRarity(filterType(ITEMS, ['Potion']), ['Legendary']).sort((a, b) => {return Math.random() > 0.5})

    constructor(wealth)
    {
        super(wealth)

        PotionShop.reset()
        for(let i = 0; i < this.numCommon; i++) this.commonItems.push(PotionShop.commonShopItems[i % PotionShop.commonShopItems.length])
        for(let i = 0; i < this.numUncommon; i++) this.uncommonItems.push(PotionShop.uncommonShopItems[i % PotionShop.uncommonShopItems.length])
        for(let i = 0; i < this.numRare; i++) this.rareItems.push(PotionShop.rareShopItems[i % PotionShop.rareShopItems.length])
        for(let i = 0; i < this.numVeryrare; i++) this.veryrareItems.push(PotionShop.veryrareShopItems[i % PotionShop.veryrareShopItems.length])
        for(let i = 0; i < this.numLegendary; i++) this.legendaryItems.push(PotionShop.legendaryShopItems[i % PotionShop.legendaryShopItems.length])
    }

    static reset = () =>
    {
        this.commonShopItems = filterRarity(filterType(ITEMS, ['Potion']), ['Common']).sort((a, b) => {return Math.random() > 0.5})
        this.uncommonShopItems = filterRarity(filterType(ITEMS, ['Potion']), ['Uncommon']).sort((a, b) => {return Math.random() > 0.5})
        this.rareShopItems = filterRarity(filterType(ITEMS, ['Potion']), ['Rare']).sort((a, b) => {return Math.random() > 0.5})
        this.veryrareShopItems = filterRarity(filterType(ITEMS, ['Potion']), ['Very Rare']).sort((a, b) => {return Math.random() > 0.5})
        this.legendaryShopItems = filterRarity(filterType(ITEMS, ['Potion']), ['Legendary']).sort((a, b) => {return Math.random() > 0.5})
    }
}

class OditiesShop extends Shop
{
    static commonShopItems = filterRarity(filterType(ITEMS, ['Ring', 'Rod', 'Scroll', 'Wondrous Items']), ['Common']).sort((a, b) => {return Math.random() > 0.5})
    static uncommonShopItems = filterRarity(filterType(ITEMS, ['Ring', 'Rod', 'Scroll', 'Wondrous Items']), ['Uncommon']).sort((a, b) => {return Math.random() > 0.5})
    static rareShopItems = filterRarity(filterType(ITEMS, ['Ring', 'Rod', 'Scroll', 'Wondrous Items']), ['Rare']).sort((a, b) => {return Math.random() > 0.5})
    static veryrareShopItems = filterRarity(filterType(ITEMS, ['Ring', 'Rod', 'Scroll', 'Wondrous Items']), ['Very Rare']).sort((a, b) => {return Math.random() > 0.5})
    static legendaryShopItems = filterRarity(filterType(ITEMS, ['Ring', 'Rod', 'Scroll', 'Wondrous Items']), ['Legendary']).sort((a, b) => {return Math.random() > 0.5})

    constructor(wealth)
    {
        super(wealth)

        OditiesShop.reset()
        for(let i = 0; i < this.numCommon; i++) this.commonItems.push(OditiesShop.commonShopItems[i % OditiesShop.commonShopItems.length])
        for(let i = 0; i < this.numUncommon; i++) this.uncommonItems.push(OditiesShop.uncommonShopItems[i % OditiesShop.uncommonShopItems.length])
        for(let i = 0; i < this.numRare; i++) this.rareItems.push(OditiesShop.rareShopItems[i % OditiesShop.rareShopItems.length])
        for(let i = 0; i < this.numVeryrare; i++) this.veryrareItems.push(OditiesShop.veryrareShopItems[i % OditiesShop.veryrareShopItems.length])
        for(let i = 0; i < this.numLegendary; i++) this.legendaryItems.push(OditiesShop.legendaryShopItems[i % OditiesShop.legendaryShopItems.length])
    }

    static reset = () =>
    {
        this.commonShopItems = filterRarity(filterType(ITEMS, ['Ring', 'Rod', 'Scroll', 'Wondrous Items']), ['Common']).sort((a, b) => {return Math.random() > 0.5})
        this.uncommonShopItems = filterRarity(filterType(ITEMS, ['Ring', 'Rod', 'Scroll', 'Wondrous Items']), ['Uncommon']).sort((a, b) => {return Math.random() > 0.5})
        this.rareShopItems = filterRarity(filterType(ITEMS, ['Ring', 'Rod', 'Scroll', 'Wondrous Items']), ['Rare']).sort((a, b) => {return Math.random() > 0.5})
        this.veryrareShopItems = filterRarity(filterType(ITEMS, ['Ring', 'Rod', 'Scroll', 'Wondrous Items']), ['Very Rare']).sort((a, b) => {return Math.random() > 0.5})
        this.legendaryShopItems = filterRarity(filterType(ITEMS, ['Ring', 'Rod', 'Scroll', 'Wondrous Items']), ['Legendary']).sort((a, b) => {return Math.random() > 0.5})
    }
}