/*****************************
*
*   Fonctions mathématiques
*
******************************/
//Fonction carré
function m_sqr(x)
{
    return x*x;
}

//Calcul de la distance entre 2 points A et B, implique que A et B soit des objets ayant des propriété x et y
function m_dist(a, b)
{
    return Math.sqrt(m_sqr(b.x - a.x) + m_sqr(b.y - b.y));
}

//Calcul d'un angle en radian entre 2 points A et B
function m_angleRad(a, b)
{
    return Math.atan2(a.x - b.x, a.y - b.y);
}

//Calcul d'un angle en degrés entre 2 points A et B
function m_angleDeg(a, b)
{
    var _a = Math.atan2(a.x - b.x, a.y - b.y);
    return _a * (180 / Math.PI);
}

//Compare 2 chiffres et retourne le plus grand
function m_compareN(a, b)
{
    if(a>b)
        return a;
    else
        return b;
}